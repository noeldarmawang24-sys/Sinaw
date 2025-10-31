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
            d="M50,0 L95,25 L85,60 C85,68 80,70 75,70 H25 C20,70 15,68 15,60 L5,25 Z M40,30 L70,45 L40,60 Z"
        />
    </svg>
);

export default Logo;