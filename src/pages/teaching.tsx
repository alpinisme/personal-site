import React, { ReactElement } from 'react';
import { graphql } from 'gatsby';

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
    const posts = data.allMarkdownRemark.edges;

    return (
        <Layout
            location={location}
            title={'Home'}
            width="w-11/12 md:w-10/12 lg:w-8/12 xl:w-7/12"
        >
            <SEO title="Teaching Experience" />
            <h1 className="text-center text-3xl lg:text-4xl my-10">Teaching</h1>
            <h2 className="-mb-6 mt-8 text-center text-xl font-semibold text-ocean-600">
                Past Courses
            </h2>
            <dl>
                {posts.map(({ node }) => {
                    const title = node.frontmatter.title || node.fields.slug;
                    return (
                        <div
                            className="my-16 md:ml-3 md:flex md:items-stretch md:my-12"
                            key={node.fields.slug as string}
                        >
                            <dt className="md:w-1/5">
                                <div className="pr-10 pl-4 mb-5 inline-block border-solid border-ocean-600 border-b-2 border-l-2 md:border-l-0 md:pl-0 md:pr-4 md:text-right md:border-b-0 md:border-r-2 ">
                                    <h3 className="md:-ml-2 md:pb-3 text-xl not-italic text-ocean-600 leading-tight ">
                                        {title}
                                    </h3>

                                    <small className="mt-1 pb-4 md:mt-0 md:pb-8 text-gray-700 text-sm block">
                                        {node.frontmatter.school}
                                    </small>
                                </div>
                            </dt>
                            <dd
                                className="ml-4 w-4/5 text-lg md:leading-relaxed course-description"
                                dangerouslySetInnerHTML={{
                                    __html: node.html,
                                }}
                            />
                        </div>
                    );
                })}
            </dl>
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
