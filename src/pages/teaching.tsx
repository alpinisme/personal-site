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
        <Layout
            location={location}
            title={siteTitle}
            width="w-11/12 md:w-10/12 lg:w-8/12 xl:w-7/12"
        >
            <SEO title="Teaching Experience" />
            <h1 className="text-center text-2xl">Teaching</h1>
            <h2 className="-mb-6 mt-8 text-center text-xl font-semibold text-ocean-600">
                Past Courses
            </h2>
            <>
                {posts.map(({ node }) => {
                    const title = node.frontmatter?.title || node.fields?.slug;
                    return (
                        <div
                            className="md:ml-3 flex items-stretch my-12"
                            key={node.fields?.slug as string}
                        >
                            <div className="w-1/5">
                                <h3
                                    className="-ml-2 pr-3 pb-5 text-xl not-italic text-ocean-600 leading-tight text-right border-r-2 border-solid border-ocean-600"
                                    dangerouslySetInnerHTML={{
                                        __html: title,
                                    }}
                                />
                            </div>
                            <div
                                className="ml-3 w-4/5 text-lg md:leading-relaxed course-description"
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
        allMarkdownRemark(
            filter: { frontmatter: { school: { ne: null } } }
            sort: { order: DESC, fields: frontmatter___year }
        ) {
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
