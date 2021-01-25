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

/**
 * String.prototype.replaceAll() polyfill
 * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (str, newStr) {
        // If a regex pattern
        if (
            Object.prototype.toString.call(str).toLowerCase() ===
            '[object regexp]'
        ) {
            return this.replace(str, newStr);
        }

        // If a string
        return this.replace(new RegExp(str, 'g'), newStr);
    };
}

function convertNoteFormatting(html: string) {
    const markup = (id: string) =>
        `<label for="note-${id}" class="note-toggle note-marker"></label><input type="checkbox" id="note-${id}"class="note-toggle"/>`;
    const regex = /\[>\d+\]/g;
    return html.replaceAll(regex, (match) => markup(match.slice(2, -1)));
}

function BlogPostTemplate({
    data,
    location,
    pageContext,
}: Props): ReactElement {
    const post = data.markdownRemark;
    const siteTitle = data.site?.siteMetadata?.title as string;
    const { previous, next } = pageContext;
    const html = convertNoteFormatting(post?.html || '');

    return (
        <Layout location={location} title={siteTitle}>
            <SEO
                title={post?.frontmatter?.title as string}
                description={
                    post?.frontmatter?.description || (post?.excerpt as string)
                }
            />
            <h1 className="text-coral-600 text-3xl font-black mt-8 mb-2 text-center">
                {post?.frontmatter?.title as string}
            </h1>
            <p className="text-ocean-500 text-sm mb-2 text-center">
                {post?.frontmatter?.date}
            </p>
            <article
                className="blog-post my-8 md:p-2 lg:text-justify hyphens-manual"
                dangerouslySetInnerHTML={{ __html: html }}
            />
            <Bio />

            <ul className="flex flex-wrap justify-between my-8">
                <li>
                    {previous && (
                        <Link
                            className="text-green-500 text-lg ml-2"
                            to={previous.fields.slug}
                            rel="prev"
                        >
                            ← {previous.frontmatter.title}
                        </Link>
                    )}
                </li>
                <li>
                    {next && (
                        <Link
                            className="text-green-500 text-lg mr-2"
                            to={next.fields.slug}
                            rel="next"
                        >
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
