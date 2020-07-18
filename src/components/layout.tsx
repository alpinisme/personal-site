import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import './layout.css';

interface Props {
    location: { pathname: string };
    title: string;
    children?: ReactElement[];
}

function Layout({ location, title, children }: Props): ReactElement {
    const rootPath = `${__PATH_PREFIX__}/`;

    const header =
        location.pathname === rootPath ? (
            <h1 className="text-coral-600 text-5xl mt-10 mb-6 font-sans font-black text-center">
                <Link to={`/`}>{title}</Link>
            </h1>
        ) : (
            <h3>
                <Link to={`/`}>{title}</Link>
            </h3>
        );

    return (
        <div className="bg-ocean-400 flex flex-col leading-relaxed">
            <div className="mx-auto p-6 my-6 bg-gray-100 min-h-screen w-11/12 md:w-9/12 lg:w-7/12 xl:w-6/12 text-ocean-800 shadow-lg flex-auto">
                <header>{header}</header>
                <main>{children}</main>
            </div>

            <footer className="text-sm text-ocean-300 my-2 self-center">
                © {new Date().getFullYear()}, Built with
                <a href="https://www.gatsbyjs.org"> Gatsby</a>, hosted on
                <a href="https://www.netlify.com"> Netlify</a>
            </footer>
        </div>
    );
}

export default Layout;
