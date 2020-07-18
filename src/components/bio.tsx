/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { ReactElement } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

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
        <div
            style={{
                display: `flex`,
            }}
        >
            <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                    marginBottom: 0,
                    minWidth: 50,
                    borderRadius: `100%`,
                }}
                imgStyle={{
                    borderRadius: `50%`,
                }}
            />
            <p className="text-center">
                Written by <strong>{author}</strong>. He doesn&apos;t like{' '}
                <a className="link" href={`https://twitter.com/`}>
                    Twitter
                </a>
            </p>
        </div>
    );
};

export default Bio;
