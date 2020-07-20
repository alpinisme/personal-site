import React, { ReactElement } from 'react';
import { Link, graphql } from 'gatsby';
import { BlogIndexQuery } from '../../graphql-types';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';

interface Props {
    data: BlogIndexQuery;
    location: { pathname: string };
}

function BlogIndex({ data, location }: Props): ReactElement {
    const siteTitle = data.site?.siteMetadata?.title as string;
    const posts = data.allMarkdownRemark.edges;

    return (
        <Layout location={location} title={siteTitle}>
            <SEO title="All posts" />
            <Bio />
            <>
                {posts.map(({ node }) => {
                    const title = node.frontmatter?.title || node.fields?.slug;
                    return (
                        <div
                            className="border-l-2 border-solid border-coral-600 pl-4 md:ml-3 pr-2"
                            key={node.fields?.slug as string}
                        >
                            <h3 className="mt-10">
                                <Link
                                    className="text-coral-600 text-2xl italic leading-tight"
                                    to={node.fields?.slug as string}
                                >
                                    {title}
                                </Link>
                            </h3>
                            <small className="text-sm text-gray-700">
                                {node.frontmatter?.date}
                            </small>
                            <p
                                className="text-lg my-3"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        node.frontmatter?.description ||
                                        (node.excerpt as string),
                                }}
                            />
                        </div>
                    );
                })}
            </>
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
