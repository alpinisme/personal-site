import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import './layout.css';

interface Props {
    location: { pathname: string };
    title: string;
    children?: ReactElement[];
    width?: string;
}

function Layout({
    location,
    title,
    children,
    width = 'w-11/12 md:w-10/12 lg:w-9/12 xl:w-7/12',
}: Props): ReactElement {
    const isInBlog = location.pathname.startsWith('/blog');
    const homePath = isInBlog ? '/blog' : '/';
    const padding = isInBlog ? 'lg:pr-64' : '';

    const header =
        location.pathname === '/blog' ? (
            <h1 className="text-4xl font-bold mt-12 mb-6 text-center">
                <Link to={homePath} className="no-underline">
                    {title}
                </Link>
            </h1>
        ) : (
            <h3>
                <Link
                    to={homePath}
                    className="text-ocean-800 text-base not-italic no-underline"
                >
                    Back to {title}
                </Link>
            </h3>
        );

    return (
        <div className={`flex flex-col leading-normal ${padding}`}>
            <div
                className={`mx-auto p-5 md:p-8 my-6 bg-gray-100 min-h-screen text-ocean-800 shadow-lg flex-auto ${width}`}
            >
                <header>{header}</header>
                <main>{children}</main>
            </div>

            <footer className="text-sm text-ocean-200 mt-2 mb-8 self-center">
                © {new Date().getFullYear()} Matthew Nelson
                <Link to="/" className="ml-14">
                    Back to Homepage
                </Link>
            </footer>
        </div>
    );
}

export default Layout;
