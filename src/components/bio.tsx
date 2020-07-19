/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { ReactElement } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const Bio = (): ReactElement => {
    const data = useStaticQuery(graphql`
        query BioQuery {
            avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
                childImageSharp {
                    fixed(width: 50, height: 50) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
            site {
                siteMetadata {
                    author
                }
            }
        }
    `);

    const { author } = data.site.siteMetadata;
    return (
        <div className="flex items-center justify-center">
            <svg
                className="stroke-current stroke-2 w-3 mr-1 md:mr-2 text-green-600 transform rotate-45"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
            >
                <rect width="80" height="80" x="10" y="10" strokeWidth="4" />
                <circle r="45" cx="50" cy="50" fill="white" strokeWidth="4" />
            </svg>
            <p className="self-center mx-2">
                Written by <strong>{author}</strong>. He doesn&rsquo;t like{' '}
                <a className="link" href={`https://twitter.com/`}>
                    Twitter
                </a>
            </p>
            <svg
                className="stroke-current stroke-2 w-3 md:ml-2 transform rotate-45 text-green-600"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
            >
                <rect width="80" height="80" x="10" y="10" strokeWidth="4" />
                <circle r="45" cx="50" cy="50" fill="white" strokeWidth="4" />
            </svg>
        </div>
    );
};

export default Bio;
