import React from 'react';

const DoctorSilhouette = ({ width = 200, height = 280, color = '#166534' }) => {
    return (
        <svg 
            width={width} 
            height={height} 
            viewBox="0 0 200 280" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Head */}
            <ellipse cx="100" cy="45" rx="30" ry="35" fill={color} />
            
            {/* Hair */}
            <path 
                d="M70 35 Q70 15 100 12 Q130 15 130 35 Q125 25 100 22 Q75 25 70 35" 
                fill={color}
            />
            
            {/* Neck */}
            <rect x="88" y="75" width="24" height="20" fill={color} />
            
            {/* Doctor's Coat (White Coat) */}
            <path 
                d="M45 95 Q45 90 100 85 Q155 90 155 95 L160 230 Q160 235 100 240 Q40 235 40 230 Z" 
                fill="#fff"
                stroke={color}
                strokeWidth="2"
            />
            
            {/* Coat Collar/Lapels */}
            <path 
                d="M75 95 L100 130 L125 95" 
                stroke={color} 
                strokeWidth="3" 
                fill="none"
            />
            
            {/* Undershirt visible at collar */}
            <path 
                d="M85 95 L100 115 L115 95" 
                fill="#E8F5E9"
            />
            
            {/* Coat Pockets */}
            <rect x="55" y="160" width="30" height="35" rx="3" fill="none" stroke={color} strokeWidth="1.5" />
            <rect x="115" y="160" width="30" height="35" rx="3" fill="none" stroke={color} strokeWidth="1.5" />
            
            {/* Pen in pocket */}
            <rect x="125" y="155" width="3" height="15" fill="#1e40af" />
            <rect x="125" y="152" width="3" height="5" fill="#FFD700" />
            
            {/* Coat Buttons */}
            <circle cx="100" cy="145" r="4" fill={color} />
            <circle cx="100" cy="165" r="4" fill={color} />
            <circle cx="100" cy="185" r="4" fill={color} />
            
            {/* Left Arm */}
            <path 
                d="M45 100 Q15 115 10 160 Q5 185 20 195 Q28 200 35 190 Q50 170 52 140 Q53 120 45 100" 
                fill="#fff"
                stroke={color}
                strokeWidth="2"
            />
            
            {/* Right Arm */}
            <path 
                d="M155 100 Q185 115 190 160 Q195 185 180 195 Q172 200 165 190 Q150 170 148 140 Q147 120 155 100" 
                fill="#fff"
                stroke={color}
                strokeWidth="2"
            />
            
            {/* Left Hand */}
            <ellipse cx="25" cy="200" rx="12" ry="10" fill={color} />
            
            {/* Right Hand */}
            <ellipse cx="175" cy="200" rx="12" ry="10" fill={color} />
            
            {/* Stethoscope */}
            {/* Ear pieces */}
            <circle cx="85" cy="90" r="4" fill="#4B5563" />
            <circle cx="115" cy="90" r="4" fill="#4B5563" />
            
            {/* Stethoscope Tubes */}
            <path 
                d="M85 94 Q85 110 90 120 Q95 135 100 145" 
                stroke="#4B5563" 
                strokeWidth="3" 
                fill="none"
            />
            <path 
                d="M115 94 Q115 110 110 120 Q105 135 100 145" 
                stroke="#4B5563" 
                strokeWidth="3" 
                fill="none"
            />
            
            {/* Stethoscope Chest Piece */}
            <circle cx="100" cy="155" r="12" fill="#4B5563" />
            <circle cx="100" cy="155" r="8" fill="#6B7280" />
            <circle cx="100" cy="155" r="4" fill="#9CA3AF" />
            
            {/* ID Badge */}
            <rect x="55" y="120" width="25" height="35" rx="2" fill="#f0f0f0" stroke={color} strokeWidth="1" />
            <rect x="58" y="125" width="19" height="12" fill="#3b82f6" />
            <line x1="58" y1="142" x2="77" y2="142" stroke="#ccc" strokeWidth="2" />
            <line x1="58" y1="148" x2="73" y2="148" stroke="#ccc" strokeWidth="2" />
            
            {/* Medical Cross on Badge */}
            <rect x="64" y="127" width="3" height="9" fill="#fff" />
            <rect x="61" y="130" width="9" height="3" fill="#fff" />
            
            {/* Pants/Legs */}
            <path 
                d="M60 235 L55 270 Q55 275 65 275 L80 275 Q85 275 85 270 L90 235" 
                fill={color}
            />
            <path 
                d="M140 235 L145 270 Q145 275 135 275 L120 275 Q115 275 115 270 L110 235" 
                fill={color}
            />
        </svg>
    );
};

export default DoctorSilhouette;
