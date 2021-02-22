import React, { ReactElement } from 'react';
import { Link, graphql } from 'gatsby';
import { BlogIndexQuery } from '../../graphql-types';

import Layout from '../components/layout';
import SEO from '../components/seo';

interface Props {
    data: BlogIndexQuery;
    location: { pathname: string };
}

function BlogIndex({ data, location }: Props): ReactElement {
    const blogName = data.site?.siteMetadata?.blogName as string;
    const siteDescription = data.site?.siteMetadata?.description;
    const posts = data.allMarkdownRemark.edges;

    return (
        <Layout location={location} title={blogName}>
            <SEO title="All posts" />
            <div className="text-center italic mb-16 w-64 mx-auto text-base">
                {siteDescription}
            </div>
            <>
                {posts.map(({ node }) => {
                    const title = node.frontmatter?.title || node.fields?.slug;
                    return (
                        <div
                            className="border-l-2 border-solid border-cerise-700 pl-4 md:ml-3 pr-2"
                            key={node.fields?.slug as string}
                        >
                            <h2 className="mt-10 text-2xl text-cerise-700 leading-tight">
                                <Link
                                    to={node.fields?.slug as string}
                                    className="no-underline"
                                >
                                    {title}
                                </Link>
                            </h2>
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
                blogName
                description
            }
        }
        allMarkdownRemark(
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { fileAbsolutePath: { regex: "/content/blog/" } }
        ) {
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
