import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => (
    <svg 
        viewBox="0 0 100 80" 
        className={className} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="#4FA66D"
        aria-label="SINAW Logo"
        role="img"
    >
        <path 
            fillRule="evenodd"
            clipRule="evenodd"
            d="M50,0 L95,25 V60 C95,68.28 88.28,75 80,75 H20 C11.72,75 5,68.28 5,60 V25 L50,0 Z M69,42.5 L44,27.5 V57.5 L69,42.5 Z"
        />
    </svg>
);

export default Logo;