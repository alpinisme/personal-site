import React, { ReactElement } from 'react';
import { Link, graphql } from 'gatsby';
import { BlogPostBySlugQuery } from '../../graphql-types';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';

interface Props {
    location: { pathname: string };
    data: BlogPostBySlugQuery;
    pageContext: {
        previous: {
            fields: {
                slug: string;
            };
            frontmatter: {
                title: string;
            };
        };
        next: {
            fields: {
                slug: string;
            };
            frontmatter: {
                title: string;
            };
        };
    };
}

function BlogPostTemplate({
    data,
    location,
    pageContext,
}: Props): ReactElement {
    const post = data.markdownRemark;
    const siteTitle = data.site?.siteMetadata?.title as string;
    const { previous, next } = pageContext;

    return (
        <Layout location={location} title={siteTitle}>
            <SEO
                title={post?.frontmatter?.title as string}
                description={
                    post?.frontmatter?.description || (post?.excerpt as string)
                }
            />
            <h1
                style={{
                    marginBottom: 0,
                }}
            >
                {post?.frontmatter?.title as string}
            </h1>
            <p
                style={{
                    display: `block`,
                }}
            >
                {post?.frontmatter?.date}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post?.html as string }} />
            <hr />
            <Bio />

            <ul
                style={{
                    display: `flex`,
                    flexWrap: `wrap`,
                    justifyContent: `space-between`,
                    listStyle: `none`,
                    padding: 0,
                }}
            >
                <li>
                    {previous && (
                        <Link to={previous.fields.slug} rel="prev">
                            ← {previous.frontmatter.title}
                        </Link>
                    )}
                </li>
                <li>
                    {next && (
                        <Link to={next.fields.slug} rel="next">
                            {next.frontmatter.title} →
                        </Link>
                    )}
                </li>
            </ul>
        </Layout>
    );
}

export default BlogPostTemplate;

export const pageQuery = graphql`
    query BlogPostBySlug($slug: String!) {
        site {
            siteMetadata {
                title
                author
            }
        }
        markdownRemark(fields: { slug: { eq: $slug } }) {
            id
            excerpt(pruneLength: 160)
            html
            frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
                description
            }
        }
    }
`;
