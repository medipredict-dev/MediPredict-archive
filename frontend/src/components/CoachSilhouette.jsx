import React from 'react';

const CoachSilhouette = ({ width = 200, height = 280, color = '#1a365d' }) => {
    return (
        <svg 
            width={width} 
            height={height} 
            viewBox="0 0 200 280" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Coach Cap */}
            <ellipse cx="100" cy="35" rx="45" ry="12" fill={color} />
            <path d="M55 35 Q55 20 100 15 Q145 20 145 35" fill={color} />
            <rect x="50" y="30" width="100" height="10" fill={color} />
            {/* Cap Brim */}
            <ellipse cx="100" cy="40" rx="55" ry="8" fill={color} />
            
            {/* Head */}
            <ellipse cx="100" cy="65" rx="30" ry="35" fill={color} />
            
            {/* Neck */}
            <rect x="88" y="95" width="24" height="20" fill={color} />
            
            {/* Body/Torso - Polo Shirt Style */}
            <path 
                d="M50 115 Q50 110 100 105 Q150 110 150 115 L155 200 Q155 210 100 215 Q45 210 45 200 Z" 
                fill={color}
            />
            
            {/* Collar */}
            <path 
                d="M80 105 L100 125 L120 105" 
                stroke="#fff" 
                strokeWidth="3" 
                fill="none"
            />
            
            {/* COACH Text on Shirt */}
            <text 
                x="100" 
                y="165" 
                textAnchor="middle" 
                fill="#fff" 
                fontSize="20" 
                fontWeight="bold" 
                fontFamily="Arial, sans-serif"
            >
                COACH
            </text>
            
            {/* Left Arm */}
            <path 
                d="M50 120 Q20 130 15 170 Q10 190 25 200 Q30 205 40 195 Q50 180 55 155 Q58 140 50 120" 
                fill={color}
            />
            
            {/* Right Arm */}
            <path 
                d="M150 120 Q180 130 185 170 Q190 190 175 200 Q170 205 160 195 Q150 180 145 155 Q142 140 150 120" 
                fill={color}
            />
            
            {/* Left Hand (holding clipboard) */}
            <ellipse cx="30" cy="205" rx="12" ry="10" fill={color} />
            
            {/* Right Hand */}
            <ellipse cx="170" cy="205" rx="12" ry="10" fill={color} />
            
            {/* Clipboard in hand */}
            <rect x="15" y="195" width="30" height="40" rx="2" fill="#8B4513" />
            <rect x="18" y="200" width="24" height="30" fill="#fff" />
            <line x1="20" y1="208" x2="40" y2="208" stroke="#ccc" strokeWidth="1" />
            <line x1="20" y1="214" x2="38" y2="214" stroke="#ccc" strokeWidth="1" />
            <line x1="20" y1="220" x2="40" y2="220" stroke="#ccc" strokeWidth="1" />
            
            {/* Pants/Legs */}
            <path 
                d="M60 210 L55 270 Q55 275 65 275 L80 275 Q85 275 85 270 L90 215" 
                fill={color}
            />
            <path 
                d="M140 210 L145 270 Q145 275 135 275 L120 275 Q115 275 115 270 L110 215" 
                fill={color}
            />
            
            {/* Whistle around neck */}
            <ellipse cx="125" cy="130" rx="8" ry="6" fill="#FFD700" />
            <line x1="117" y1="130" x2="100" y2="115" stroke="#333" strokeWidth="2" />
        </svg>
    );
};

export default CoachSilhouette;
