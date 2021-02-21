import React, { ReactElement } from 'react';

export default function Loading(props: Props): ReactElement {
    const message = props.message ?? 'Loading';

    return <div className="m-4 text-center mx-auto">{message}</div>;
}

interface Props {
    message?: string;
}
