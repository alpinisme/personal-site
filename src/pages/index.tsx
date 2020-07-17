import React, { ReactElement } from 'react';
import { Link, graphql } from 'gatsby';
import { BlogIndexQuery } from '../../graphql-types';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';

interface Props {
    data: BlogIndexQuery;
    location: string;
}

function BlogIndex({ data, location }: Props): ReactElement {
    const siteTitle = data.site?.siteMetadata?.title;
    const posts = data.allMarkdownRemark.edges;

    return (
        <Layout location={location} title={siteTitle}>
            <SEO title="All posts" />
            <Bio />
            {posts.map(({ node }) => {
                const title = node.frontmatter?.title || node.fields?.slug;
                return (
                    <div key={node.fields?.slug as string}>
                        <h3>
                            <Link
                                className="text-indigo-500"
                                to={node.fields?.slug as string}
                            >
                                {title}
                            </Link>
                        </h3>
                        <small>{node.frontmatter?.date}</small>
                        <p
                            dangerouslySetInnerHTML={{
                                __html:
                                    node.frontmatter?.description ||
                                    (node.excerpt as string),
                            }}
                        />
                    </div>
                );
            })}
        </Layout>
    );
}

export default BlogIndex;

export const pageQuery = graphql`
    query BlogIndex {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
            edges {
                node {
                    excerpt
                    fields {
                        slug
                    }
                    frontmatter {
                        date(formatString: "MMMM DD, YYYY")
                        title
                        description
                    }
                }
            }
        }
    }
`;
