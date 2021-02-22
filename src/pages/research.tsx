import React, { ReactElement } from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

interface ResearchPageProps {
    location: {
        pathname: string;
    };
    data: {
        site: {
            siteMetadata: {
                title: string;
                author: string;
            };
        };
        publications: {
            edges: Array<{ node: Publication }>;
        };
        presentations: {
            edges: Array<{ node: Presentation }>;
        };
    };
}

interface Publication {
    html: string;
    frontmatter: {
        title: string;
        venue: string;
        abstract: string;
        year: string;
        link: string;
    };
}

interface Presentation {
    frontmatter: {
        title: string;
        location: string;
        month: string;
        year: string;
        occasion: string;
    };
}

export default function Research({
    data,
    location,
}: ResearchPageProps): ReactElement {
    const publications = data.publications.edges.map((each) => each.node);
    const presentations = data.presentations.edges.map((each) => each.node);

    const publicationList = (
        <>
            {publications.map((pub) => (
                <div key={pub.frontmatter.title} className="my-6">
                    <div className="pl-12 -indent-4">
                        <a href={pub.frontmatter.link}>
                            {pub.frontmatter.title}
                        </a>
                        .{' '}
                        <span className="italic">{pub.frontmatter.venue}.</span>{' '}
                        {pub.frontmatter.year},
                    </div>
                    <p className="mt-2">{pub.frontmatter.abstract}</p>
                </div>
            ))}{' '}
        </>
    );

    const presentationList = (
        <>
            {presentations.map((pres) => (
                <div
                    key={pres.frontmatter.title}
                    className="my-6 pl-12 -indent-4"
                >
                    &ldquo;{pres.frontmatter.title}.&rdquo;{' '}
                    <span className="italic">{pres.frontmatter.occasion},</span>{' '}
                    {pres.frontmatter.location}, {pres.frontmatter.month}{' '}
                    {pres.frontmatter.year}.
                </div>
            ))}
        </>
    );

    return (
        <Layout
            location={location}
            title="Home"
            width="w-11/12 md:w-10/12 lg:w-8/12 xl:w-7/12"
        >
            <SEO title="Research Experience" />
            <h1 className="text-center text-3xl lg:text-4xl my-10">Research</h1>

            <h2 className=" mt-8 text-center text-xl font-semibold text-ocean-600">
                Publications
            </h2>
            {publicationList}

            <h2 className="mt-8 text-center text-xl font-semibold text-ocean-600">
                Presentations
            </h2>
            {presentationList}

            <h2 className="mt-8 text-center text-xl font-semibold text-ocean-600">
                Projects and Collaborations
            </h2>
            <p className="text-center">Coming soon</p>
        </Layout>
    );
}

export const pageQuery = graphql`
    query ResearchPage {
        site {
            siteMetadata {
                title
                author
            }
        }
        publications: allMarkdownRemark(
            filter: { fileAbsolutePath: { regex: "/publication/" } }
            sort: { order: DESC, fields: frontmatter___year }
        ) {
            edges {
                node {
                    frontmatter {
                        year
                        venue
                        title
                        abstract
                        link
                    }
                    html
                }
            }
        }
        presentations: allMarkdownRemark(
            filter: { fileAbsolutePath: { regex: "/presentation/" } }
            sort: { order: DESC, fields: frontmatter___year }
        ) {
            edges {
                node {
                    frontmatter {
                        year
                        month
                        occasion
                        title
                        location
                    }
                }
            }
        }
    }
`;
