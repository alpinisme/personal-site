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
    const rootPath = `${__PATH_PREFIX__}/`;

    const header =
        location.pathname === rootPath ? (
            <h1 className="text-4xl font-bold mt-12 mb-6 text-center">
                <Link to={`/`}>{title}</Link>
            </h1>
        ) : (
            <h3>
                <Link to={`/`} className="text-ocean-800 text-base not-italic">
                    Back to {title}
                </Link>
            </h3>
        );

    return (
        <div className="bg-ocean-400 flex flex-col leading-normal lg:pr-64">
            <div
                className={`mx-auto p-5 md:p-8 my-6 bg-gray-100 min-h-screen text-ocean-800 shadow-lg flex-auto ${width}`}
            >
                <header>{header}</header>
                <main>{children}</main>
            </div>

            <footer className="text-sm text-ocean-300 my-2 self-center">
                © {new Date().getFullYear()} M
                <Link to={'/teaching/'} className="hidden">
                    Teaching
                </Link>
            </footer>
        </div>
    );
}

export default Layout;
