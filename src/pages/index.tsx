import { graphql, Link } from 'gatsby';
import React, { ReactElement } from 'react';
import SEO from '../components/seo';
import Img, { FluidObject } from 'gatsby-image';
import './layout.css';

export default function LandingPage(props: Props): ReactElement {
    const name = props.data.site.siteMetadata.author;

    return (
        <div className="font-sans bg-ocean-800 min-h-screen lg:h-screen lg:overflow-hidden flex flex-col">
            <SEO title="Home" />
            <div className="w-screen">
                <Img
                    fluid={props.data.shoreline.childImageSharp.fluid}
                    alt="An image of me on some rocks at the beach"
                    style={{ 'clip-path': 'ellipse(98% 58% at 48% 42%)' }}
                />
            </div>
            <div className="p-6 flex-auto lg:flex lg:justify-around">
                <div className="text-center self-center">
                    <SEO title="Home" />
                    <h1 className="text-5xl text-ocean-100 mt-10 mb-10 lg:mt-0">
                        Hi, I’m {name}.
                    </h1>
                    <div className="mx-auto mb-10 w-1/2 lg:h-full lg:w-full lg:m-0">
                        <Img
                            fluid={props.data.profile.childImageSharp.fluid}
                            alt="A photo of me"
                            className="rounded-full"
                        />
                    </div>
                </div>
                <div className="self-center">
                    <h2 className="text-3xl text-cerise-500">
                        I’m a <Link to="/teaching">teacher</Link>,{' '}
                        <Link to="/research">scholar</Link>, and{' '}
                        <Link to="/dev">developer</Link>.{' '}
                    </h2>
                    <p className="text-ocean-100 mb-4 mt-6">
                        I’m also an experienced{' '}
                        <Link to="editing" className="text-cerise-400">
                            editor
                        </Link>{' '}
                        and occasional translator.
                    </p>
                    <p className="text-ocean-100 my-4">
                        If you’d like to work with me or have any questions, I’d
                        love to{' '}
                        <Link to="/contact" className="text-cerise-400">
                            hear from you
                        </Link>
                        .
                    </p>
                    <p className="text-ocean-100 my-4">
                        While you’re at it, be sure to check out my{' '}
                        <Link to="/blog" className="text-cerise-400">
                            blog
                        </Link>{' '}
                        too.
                    </p>
                </div>
            </div>
        </div>
    );
}

interface Props {
    location: { pathname: string };
    data: {
        site: {
            siteMetadata: {
                title: string;
                author: string;
            };
        };
        profile: {
            childImageSharp: {
                fluid: FluidObject | FluidObject[];
            };
        };
        shoreline: {
            childImageSharp: {
                fluid: FluidObject | FluidObject[];
            };
        };
    };
}

export const pageQuery = graphql`
    query LandingPage {
        site {
            siteMetadata {
                title
                author
            }
        }
        shoreline: file(relativePath: { eq: "shoreline.png" }) {
            childImageSharp {
                fluid(maxWidth: 1600) {
                    ...GatsbyImageSharpFluid
                }
            }
        }
        profile: file(relativePath: { eq: "profile.png" }) {
            childImageSharp {
                fluid(maxWidth: 300) {
                    ...GatsbyImageSharpFluid
                }
            }
        }
    }
`;
