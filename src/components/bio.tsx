import React, { ReactElement } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Icon from './icon';

const Bio = (): ReactElement => {
    const data = useStaticQuery(graphql`
        query BioQuery {
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
            <Icon className="mr-1 md:mr-2" />
            <p className="self-center mx-2">
                Written by <strong>{author}</strong>
            </p>
            <Icon className="ml-1 md:ml-2" />
        </div>
    );
};

export default Bio;
