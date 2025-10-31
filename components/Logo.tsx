import React from 'react';

interface LogoProps {
    className?: string;
}

// This component renders the full SINAW logo as an SVG,
// matching the provided image including the icon, brand name, and tagline.
const Logo: React.FC<LogoProps> = ({ className }) => (
    <svg
        viewBox="0 0 180 185"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby="logoTitle logoDesc"
    >
        <title id="logoTitle">Logo SINAW</title>
        <desc id="logoDesc">Logo untuk SINAW E-Learning Platform. Menampilkan ikon topi wisuda hijau dengan potongan tombol putar, dengan nama SINAW dan slogan di bawahnya.</desc>
        <g fill="#1E8449">
            {/* 
              Icon shape with a play button cutout.
              fillRule="evenodd" creates a hole when one path is inside another.
            */}
            <path
                fillRule="evenodd"
                d="M90 10 L15 55 L35 115 L145 115 L165 55 Z M75 65 L110 85 L75 105 Z"
            />
            <text
                x="90"
                y="150"
                textAnchor="middle"
                fontSize="34"
                fontWeight="bold"
                fontFamily="Poppins, sans-serif"
            >
                SINAW
            </text>
            <text
                x="90"
                y="170"
                textAnchor="middle"
                fontSize="12"
                fontFamily="Poppins, sans-serif"
                letterSpacing="1.5"
            >
                E-LEARNING PLATFORM
            </text>
        </g>
    </svg>
);

export default Logo;