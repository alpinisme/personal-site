import React, { ReactElement } from 'react';

export default function Icon({ className }: Props): ReactElement {
    return (
        <svg
            className={`stroke-current stroke-2 w-3 transform rotate-45 text-cerise-800 ${className}`}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            <rect width="80" height="80" x="10" y="10" strokeWidth="4" />
            <circle r="45" cx="50" cy="50" fill="white" strokeWidth="4" />
        </svg>
    );
}

interface Props {
    className: string;
}
