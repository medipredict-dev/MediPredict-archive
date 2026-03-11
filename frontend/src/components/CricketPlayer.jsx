import React from 'react';

const CricketPlayer = ({ isBowling = true }) => {
    return (
        <svg viewBox="0 0 150 200" style={{ width: '100%', height: '100%', opacity: 0.15 }}>
            <defs>
                <linearGradient id="silhouetteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                </linearGradient>
            </defs>

            {isBowling ? (
                // Bowling action silhouette
                <g fill="url(#silhouetteGradient)">
                    {/* Head */}
                    <ellipse cx="45" cy="30" rx="12" ry="14" />
                    {/* Body leaning forward */}
                    <path d="M45 42 Q35 60 40 90 L55 95 Q60 70 55 45 Z" />
                    {/* Back leg (planted) */}
                    <path d="M40 90 L25 130 L20 170 L30 172 L38 135 L50 95" />
                    {/* Front leg (lifted) */}
                    <path d="M55 90 L75 110 L95 140 L85 145 L70 120 L55 100" />
                    {/* Bowling arm (back, holding ball) */}
                    <path d="M50 50 L30 30 L15 25 L12 30 L25 38 L45 55" />
                    {/* Ball */}
                    <circle cx="12" cy="27" r="5" fill="#dc2626" />
                    {/* Front arm */}
                    <path d="M50 55 L70 45 L90 50 L88 55 L70 52 L52 60" />
                    {/* Foot */}
                    <ellipse cx="25" cy="173" rx="10" ry="4" />
                    <ellipse cx="90" cy="143" rx="8" ry="4" />
                </g>
            ) : (
                // Running silhouette
                <g fill="url(#silhouetteGradient)">
                    {/* Head */}
                    <ellipse cx="75" cy="25" rx="12" ry="14" />
                    {/* Body */}
                    <path d="M70 38 Q65 55 68 85 L82 85 Q85 55 80 38 Z" />
                    {/* Back leg */}
                    <path d="M68 85 L50 110 L35 150 L45 155 L58 118 L72 90" />
                    {/* Front leg */}
                    <path d="M80 85 L100 100 L115 85 L120 92 L102 110 L82 95" />
                    {/* Back arm */}
                    <path d="M72 45 L55 55 L45 70 L52 75 L60 60 L75 50" />
                    {/* Front arm */}
                    <path d="M78 45 L95 35 L110 30 L108 38 L93 42 L80 50" />
                    {/* Feet */}
                    <ellipse cx="40" cy="153" rx="10" ry="4" />
                    <ellipse cx="118" cy="88" rx="8" ry="4" />
                </g>
            )}
        </svg>
    );
};

export default CricketPlayer;
