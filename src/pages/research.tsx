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
        translations: {
            edges: Array<{ node: Translation }>;
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
        role?: string;
    };
}

interface Translation {
    frontmatter: {
        title: string;
        venue: string;
        author: string;
        year: string;
        link: string;
    };
}

export default function Research({
    data,
    location,
}: ResearchPageProps): ReactElement {
    const publications = data.publications.edges.map((each) => each.node);
    const presentations = data.presentations.edges.map((each) => each.node);
    const translations = data.translations.edges.map((each) => each.node);

    const publicationList = (
        <>
            {publications.map((pub) => (
                <div key={pub.frontmatter.title} className="my-6">
                    <div className="citation">
                        <a href={pub.frontmatter.link}>
                            {pub.frontmatter.title}
                        </a>
                        ,{' '}
                        <span className="italic">{pub.frontmatter.venue}.</span>{' '}
                        {pub.frontmatter.year}.
                    </div>
                    <p className="mt-2">{pub.frontmatter.abstract}</p>
                </div>
            ))}
        </>
    );

    const presentationList = (
        <>
            {presentations.map((pres) => (
                <div key={pres.frontmatter.title} className="my-6 citation">
                    {pres.frontmatter.role && pres.frontmatter.role + ', '}
                    &ldquo;{pres.frontmatter.title}.&rdquo;{' '}
                    <span className="italic">{pres.frontmatter.occasion},</span>{' '}
                    {pres.frontmatter.location}, {pres.frontmatter.month}{' '}
                    {pres.frontmatter.year}.
                </div>
            ))}
        </>
    );

    const translationList = (
        <>
            {translations.map((trans) => (
                <div key={trans.frontmatter.title} className="my-6 citation">
                    {trans.frontmatter.link ? (
                        <a href={trans.frontmatter.link}>
                            pres.frontmatter.author
                        </a>
                    ) : (
                        trans.frontmatter.author
                    )}
                    {', '}
                    &ldquo;{trans.frontmatter.title}.&rdquo;{' '}
                    <span className="italic">{trans.frontmatter.venue},</span>{' '}
                    {trans.frontmatter.year}.
                </div>
            ))}
        </>
    );

    return (
        <Layout
            location={location}
            title="Home"
            width="w-11/12 md:w-10/12 lg:w-9/12 xl:w-7/12 2xl:w-1/2"
        >
            <SEO title="Research Experience" />
            <h1 className="text-center text-3xl lg:text-4xl my-10">Research</h1>

            <h2 className=" mt-8 text-center text-xl font-semibold text-ocean-600">
                Publications
            </h2>
            {publicationList}

            <h2 className=" mt-8 text-center text-xl font-semibold text-ocean-600">
                Translations
            </h2>
            {translationList}

            <h2 className="mt-8 text-center text-xl font-semibold text-ocean-600">
                Presentations
            </h2>
            {presentationList}

            <h2 className="mt-8 mb-6 text-center text-xl font-semibold text-ocean-600">
                Projects and Collaborations
            </h2>
            <h3>Global Cinema in Context, 2018 - Present</h3>
            <p className="mt-4 mb-6">
                Global Cinema in Context is an interdisciplinary project at the
                University of Illinois to develop digital tools for the study of
                global cinema. I've been contributing to the project since 2018,
                contributing expert knowledge on Indian cinema, building web
                apps for data entry and display, and helping guide the project.
            </p>
            <h3>Gandhari Dictionary Project, 2009 - 2010</h3>
            <p className="mt-4 mb-6">
                As an undergraduate, I contributed to the Gandhari Dictionary
                project, led by Stefan Baums. I helped digitize images and
                cross-reference Gandhari words with Sanskrit sources.
            </p>

            <h2 className="mt-8 text-center text-xl font-semibold text-ocean-600">
                Education
            </h2>
            <p className="my-6 citation">
                <span className="text-cerise-800">PhD</span> in Comparative
                Literature, May 2018, University of Illinois at
                Urbana-Champaign. Dissertation: Translingual Nostalgias in
                Modern Sanskrit and Indian Poetry in English. Co-Directors: Waïl
                Hassan and Rajeshwari Pandharipande. Committee Members: Rini
                Mehta and Michael Rothberg (UCLA).
            </p>
            <p className="my-6 citation">
                <span className="text-cerise-800">MA</span> in Comparative
                Literature (with Distinction), 2012, University of Illinois at
                Urbana-Champaign.
            </p>
            <p className="my-6 citation">
                <span className="text-cerise-800">BA</span> in English
                Literature and South Asian Languages & Literatures (Double
                Degree, Magna Cum Laude), 2009, University of Washington.
            </p>
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
                        role
                    }
                }
            }
        }
        translations: allMarkdownRemark(
            filter: { fileAbsolutePath: { regex: "/content/translation/" } }
            sort: { order: DESC, fields: frontmatter___year }
        ) {
            edges {
                node {
                    frontmatter {
                        year
                        venue
                        title
                        author
                        link
                    }
                }
            }
        }
    }
`;
