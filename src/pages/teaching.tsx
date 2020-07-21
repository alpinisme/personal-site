import React, { ReactElement } from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';

interface TeachingIndexProps {
    location: {
        pathname: string;
    };
    data: {
        site: {
            siteMetadata: {
                title: string;
            };
        };
        allMarkdownRemark: { edges: Array<{ node: Course }> };
    };
}

interface Course {
    html: string;
    frontmatter: {
        title: string;
        description: string;
        school: string;
        summary: string;
        year: string;
    };
    fields: {
        slug: string;
    };
}

function TeachingIndex({ data, location }: TeachingIndexProps): ReactElement {
    const siteTitle = data.site?.siteMetadata?.title as string;
    const posts = data.allMarkdownRemark.edges;

    return (
        <Layout location={location} title={siteTitle}>
            <SEO title="Teaching Experience" />
            <Bio />
            <>
                {posts.map(({ node }) => {
                    const title = node.frontmatter?.title || node.fields?.slug;
                    return (
                        <div
                            className="border-l-2 border-solid border-coral-600 pl-4 md:ml-3 pr-2"
                            key={node.fields?.slug as string}
                        >
                            <h2 className="mt-10 text-2xl text-coral-600 leading-tight">
                                <Link to={node.fields?.slug as string}>
                                    {title}
                                </Link>
                            </h2>
                            <div
                                className="text-lg my-3 blog-post"
                                dangerouslySetInnerHTML={{
                                    __html: node.html,
                                }}
                            />
                        </div>
                    );
                })}
            </>
        </Layout>
    );
}

export default TeachingIndex;

export const pageQuery = graphql`
    query TeachingIndex {
        allMarkdownRemark(filter: { frontmatter: { school: { ne: null } } }) {
            edges {
                node {
                    html
                    frontmatter {
                        school
                        summary
                        title
                        year
                    }
                    fields {
                        slug
                    }
                }
            }
        }
        site {
            siteMetadata {
                title
            }
        }
    }
`;
