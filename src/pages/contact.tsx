import React, { FormEvent, ReactElement } from 'react';
import { navigate } from 'gatsby';
import Layout from '../components/layout';
import SEO from '../components/seo';

export default function Contact({ location }: Props): ReactElement {
    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const body = new FormData(form);
        fetch('/', { method: 'POST', body })
            .then((res) => console.log('success!', res))
            .catch((error) => alert(error));
    }

    const msgMinLength = 50;

    return (
        <Layout location={location} title={'Home'}>
            <SEO title="Contact" />

            <form
                name="contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                className="md:w-2/3 lg:w-1/2 mx-auto my-8"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl text-center mb-4">Contact</h2>
                <div className="py-2">
                    <label>
                        Your Name: <input type="text" name="name" required />
                    </label>
                    <p className="text-sm text-gray-800 text-right">required</p>
                </div>
                <div className="hidden">
                    <label>
                        Don’t fill this out if you’re human:{' '}
                        <input name="bot-field" type="text" />
                    </label>
                </div>
                <div className="py-2">
                    <label>
                        Your Email: <input type="email" name="email" />
                    </label>
                    <p className="text-sm text-gray-800 text-right">optional</p>
                </div>
                <div className="py-2">
                    <label>
                        Message:{' '}
                        <textarea
                            className="h-48"
                            name="message"
                            minLength={msgMinLength}
                            required
                        ></textarea>
                    </label>
                    <p className="text-sm text-gray-800 text-right">
                        {msgMinLength} character minimum
                    </p>
                </div>

                <button
                    type="submit"
                    className="mx-auto block my-4 text-gray-800"
                >
                    Send
                </button>
            </form>
        </Layout>
    );
}

interface Props {
    location: {
        pathname: string;
    };
}
