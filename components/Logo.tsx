import React from 'react';

interface LogoProps {
    className?: string;
}

// This component renders the full SINAW logo as an SVG,
// matching the provided image including the icon, brand name, and tagline.
const Logo: React.FC<LogoProps> = ({ className }) => (
    <svg
        viewBox="0 0 200 220"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby="logoTitle logoDesc"
    >
        <title id="logoTitle">Logo SINAW</title>
        <desc id="logoDesc">Logo untuk SINAW E-Learning Platform. Menampilkan ikon berbentuk rumah/topi hijau dengan potongan tombol putar di tengahnya, dengan nama SINAW dan slogan di bawahnya.</desc>
        <g fill="#1E8449" fontFamily="Poppins, sans-serif">
            {/* 
              Icon shape with a play button cutout.
              fillRule="evenodd" creates a hole when one path is inside another.
            */}
            <path
                fillRule="evenodd"
                d="M100 10 L185 60 L160 130 L40 130 L15 60 Z M85 70 L125 95 L85 120 Z"
            />
            <text
                x="100"
                y="175"
                textAnchor="middle"
                fontSize="42"
                fontWeight="700"
            >
                SINAW
            </text>
            <text
                x="100"
                y="200"
                textAnchor="middle"
                fontSize="16"
                fontWeight="500"
                letterSpacing="2"
            >
                E-LEARNING PLATFORM
            </text>
        </g>
    </svg>
);

export default Logo;