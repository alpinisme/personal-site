import React, { FormEvent, ReactElement, useState } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';
import Loading from '../components/loading';
import SEO from '../components/seo';

export default function Contact({ location }: Props): ReactElement {
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
        'no submission'
    );

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setSubmissionStatus('in progress');
        const form = event.target as HTMLFormElement;
        const body = new FormData(form);
        body.set('form-name', 'contact');
        fetch('/', { method: 'POST', body })
            .then((res) => {
                if (res.ok) {
                    setSubmissionStatus('success');
                } else {
                    setSubmissionStatus('error');
                    console.log(res);
                }
            })
            .catch((error) => alert(error));
    }

    const msgMinLength = 50;

    const form = (
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
            {submissionStatus == 'error' && (
                <div className="w-full text-cerise-800 border border-cerise-800 border-solid py-4 px-5 my-8">
                    Oops, something went wrong! Since this page isn't working,
                    perhaps you'd like to reach out via email at{' '}
                    <a
                        className="underline"
                        href="mailto:m.emmett.nelson@gmail.com"
                    >
                        m.emmett.nelson@gmail.com
                    </a>
                    .
                </div>
            )}
            {submissionStatus == 'in progress' && <Loading />}{' '}
            {submissionStatus == 'no submission' && (
                <button
                    type="submit"
                    className="mx-auto block my-4 text-gray-800"
                >
                    Send
                </button>
            )}
        </form>
    );

    return (
        <Layout
            location={location}
            title={'Home'}
            width="w-11/12 md:w-10/12 lg:w-9/12 xl:w-7/12 2xl:w-1/2"
        >
            <SEO title="Contact" />

            {submissionStatus == 'success' ? (
                <div className="md:w-2/3 lg:w-1/2 mx-auto my-8">
                    <h2 className="text-2xl text-center mb-4">Contact</h2>
                    <p className="text-center my-4">
                        Success! Thanks for reaching out!
                    </p>
                    <Link to="/">Back home</Link>
                </div>
            ) : (
                form
            )}
        </Layout>
    );
}

interface Props {
    location: {
        pathname: string;
    };
}

type SubmissionStatus = 'no submission' | 'in progress' | 'success' | 'error';
