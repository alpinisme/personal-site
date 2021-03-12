import React, { ReactElement } from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';

export default function DevPage(props: Props): ReactElement {
    return (
        <Layout
            location={props.location}
            title="Home"
            width="w-11/12 md:w-10/12 lg:w-8/12 xl:w-7/12"
        >
            <SEO title="Developer Experience" />
            <h1 className="text-center text-3xl lg:text-4xl my-10">
                Developer Background
            </h1>
            <div>
                I'm a full-stack web developer with a wide range of
                programming-related interests, from data visualization to the
                more abstruse horizons of functional programming. I love solving
                puzzles and problems, finding new ways to work with and present
                information clearly, cleanly, and elegantly. You can find me on{' '}
                <a href="https://github.com/alpinisme">Github</a>, but most of
                my contributions are to private repositories. Hopefully, I'll
                find the time soon to share a few and comment on them here.
            </div>

            <h2 className="mt-12 text-center text-xl font-semibold text-ocean-600">
                Tech Stack
            </h2>

            <h3 className="my-5">Programming Languages</h3>
            <ul className="list-disc ml-5 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto my-3">
                <li>JavaScript</li>
                <li>TypeScript</li>
                <li>PHP</li>
                <li>Elm</li>
                <li>HTML</li>
                <li>CSS & SASS</li>
                <li>SQL</li>
                <li>Python</li>
            </ul>
            <p className="mt-2 mb-5">
                I also play around with Haskell and Rust, but not to any real
                degree of proficiency. And I can put together a bash script when
                I need to, but I always spend more time Googling how to
                manipulate strings than I expect.
            </p>

            <h3 className="my-5">Frameworks and Libraries</h3>
            <ul className="list-disc ml-5 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto my-3">
                <li>React</li>
                <li>Laravel</li>
                <li>D3.js</li>
                <li>IHP (learning)</li>
                <li>Livewire + Alpine.js</li>
            </ul>

            <h2 className="mt-12 text-center text-xl font-semibold text-ocean-600">
                Projects and Experience
            </h2>

            <h3 className="my-5">This website</h3>
            <p>
                This site is made with Gatsby and Netlify. It uses TypeScript,
                Graphql, Tailwind, and a few plugins, but nothing terribly fancy
                or elaborate.
            </p>
        </Layout>
    );
}

interface Props {
    location: {
        pathname: string;
    };
}
