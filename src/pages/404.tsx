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
            <h1 className="text-center text-2xl my-12">Not Found</h1>
            <p className="text-center">
                Unfortunately for you, this page doesn't exist. <br />
                If it's also unfortunate for me, let me know and I'll fix it!
            </p>
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
