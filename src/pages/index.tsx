import { graphql, Link } from 'gatsby';
import React, { ReactElement } from 'react';
import SEO from '../components/seo';

export default function LandingPage(props: Props): ReactElement {
    const name = props.data.site.siteMetadata.author;

    return (
        <div className="font-sans bg-ocean-800 min-h-screen p-6">
            <div className="md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto">
                <SEO title="Home" />
                <h1 className="text-5xl text-ocean-100 my-20">
                    Hi, I’m {name}.
                </h1>
                <h2 className="text-3xl text-cerise-500 my-10">
                    I’m a <Link to="/teaching">teacher</Link>,{' '}
                    <Link to="/research">scholar</Link>, and{' '}
                    <Link to="/dev">developer</Link>.{' '}
                </h2>
                <p className="text-ocean-100 my-6">
                    I’m also an experienced <Link to="editing">editor</Link> and
                    occasional translator.
                </p>
                <p className="text-ocean-100 my-6">
                    If you’d like to work with me or have any questions, I’d
                    love to <Link to="/contact">hear from you</Link>.
                </p>
                <p className="text-ocean-100 my-6">
                    While you’re at it, be sure to check out my{' '}
                    <Link to="/blog">blog</Link> too.
                </p>
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
    }
`;
