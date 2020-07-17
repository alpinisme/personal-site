import React, { ReactElement } from 'react';
import { graphql } from 'gatsby';
import { NotFoundPageQuery } from '../../graphql-types';

import Layout from '../components/layout';
import SEO from '../components/seo';

interface Props {
    location: { pathname: string };
    data: NotFoundPageQuery;
}

function NotFoundPage({ data, location }: Props): ReactElement {
    const siteTitle = data.site?.siteMetadata?.title as string;

    return (
        <Layout location={location} title={siteTitle}>
            <SEO title="404: Not Found" />
            <h1>Not Found</h1>
            <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
        </Layout>
    );
}

export default NotFoundPage;

export const pageQuery = graphql`
    query NotFoundPage {
        site {
            siteMetadata {
                title
            }
        }
    }
`;
