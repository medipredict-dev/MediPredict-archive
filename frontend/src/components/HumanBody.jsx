import React from 'react';

const HumanBody = ({ injuries = [], onBodyPartClick }) => {
    // Map injury body parts to SVG regions
    const getBodyPartRisk = (bodyPart) => {
        const injury = injuries.find(i => 
            i.bodyPart?.toLowerCase().includes(bodyPart.toLowerCase()) ||
            bodyPart.toLowerCase().includes(i.bodyPart?.toLowerCase())
        );
        if (!injury) return { risk: 0, color: '#3a3a4a', severity: null };
        
        const severityRisk = {
            'Critical': { risk: 90, color: '#dc2626' },
            'Severe': { risk: 70, color: '#ef4444' },
            'Moderate': { risk: 50, color: '#f97316' },
            'Mild': { risk: 25, color: '#eab308' }
        };
        return severityRisk[injury.severity] || { risk: 0, color: '#3a3a4a' };
    };

    const bodyParts = {
        head: getBodyPartRisk('head'),
        shoulder: getBodyPartRisk('shoulder'),
        chest: getBodyPartRisk('chest'),
        arm: getBodyPartRisk('arm'),
        elbow: getBodyPartRisk('elbow'),
        wrist: getBodyPartRisk('wrist'),
        hand: getBodyPartRisk('hand'),
        back: getBodyPartRisk('back'),
        hip: getBodyPartRisk('hip'),
        thigh: getBodyPartRisk('thigh'),
        hamstring: getBodyPartRisk('hamstring'),
        knee: getBodyPartRisk('knee'),
        calf: getBodyPartRisk('calf'),
        ankle: getBodyPartRisk('ankle'),
        foot: getBodyPartRisk('foot')
    };

    return (
        <div style={styles.container}>
            <svg viewBox="0 0 200 400" style={styles.svg}>
                {/* Glow filter for injured parts */}
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4a4a5a"/>
                        <stop offset="100%" stopColor="#2a2a3a"/>
                    </linearGradient>
                </defs>

                {/* Head */}
                <ellipse 
                    cx="100" cy="35" rx="25" ry="30"
                    fill={bodyParts.head.color}
                    filter={bodyParts.head.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('head')}
                />
                
                {/* Neck */}
                <rect x="90" y="62" width="20" height="15" rx="5"
                    fill="url(#bodyGradient)"
                />

                {/* Shoulders */}
                <ellipse 
                    cx="60" cy="90" rx="20" ry="12"
                    fill={bodyParts.shoulder.color}
                    filter={bodyParts.shoulder.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('shoulder')}
                />
                <ellipse 
                    cx="140" cy="90" rx="20" ry="12"
                    fill={bodyParts.shoulder.color}
                    filter={bodyParts.shoulder.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('shoulder')}
                />

                {/* Chest/Torso */}
                <path 
                    d="M60 95 Q50 100 50 130 L50 180 Q50 190 60 195 L80 200 L100 205 L120 200 L140 195 Q150 190 150 180 L150 130 Q150 100 140 95 Z"
                    fill={bodyParts.chest.color}
                    filter={bodyParts.chest.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('chest')}
                />

                {/* Upper Arms */}
                <rect 
                    x="30" y="95" width="18" height="50" rx="8"
                    fill={bodyParts.arm.color}
                    filter={bodyParts.arm.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('arm')}
                />
                <rect 
                    x="152" y="95" width="18" height="50" rx="8"
                    fill={bodyParts.arm.color}
                    filter={bodyParts.arm.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('arm')}
                />

                {/* Elbows */}
                <ellipse 
                    cx="39" cy="150" rx="10" ry="12"
                    fill={bodyParts.elbow.color}
                    filter={bodyParts.elbow.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('elbow')}
                />
                <ellipse 
                    cx="161" cy="150" rx="10" ry="12"
                    fill={bodyParts.elbow.color}
                    filter={bodyParts.elbow.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('elbow')}
                />

                {/* Forearms */}
                <rect 
                    x="32" y="160" width="14" height="45" rx="6"
                    fill={bodyParts.wrist.color}
                    filter={bodyParts.wrist.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                />
                <rect 
                    x="154" y="160" width="14" height="45" rx="6"
                    fill={bodyParts.wrist.color}
                    filter={bodyParts.wrist.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                />

                {/* Hands */}
                <ellipse 
                    cx="39" cy="215" rx="10" ry="12"
                    fill={bodyParts.hand.color}
                    filter={bodyParts.hand.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('hand')}
                />
                <ellipse 
                    cx="161" cy="215" rx="10" ry="12"
                    fill={bodyParts.hand.color}
                    filter={bodyParts.hand.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('hand')}
                />

                {/* Hip/Pelvis */}
                <path 
                    d="M65 200 Q60 210 60 220 L60 235 Q70 245 100 245 Q130 245 140 235 L140 220 Q140 210 135 200 Z"
                    fill={bodyParts.hip.color}
                    filter={bodyParts.hip.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('hip')}
                />

                {/* Thighs */}
                <rect 
                    x="62" y="245" width="28" height="55" rx="12"
                    fill={bodyParts.thigh.color}
                    filter={bodyParts.thigh.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('thigh')}
                />
                <rect 
                    x="110" y="245" width="28" height="55" rx="12"
                    fill={bodyParts.thigh.color}
                    filter={bodyParts.thigh.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('thigh')}
                />

                {/* Knees */}
                <ellipse 
                    cx="76" cy="308" rx="14" ry="12"
                    fill={bodyParts.knee.color}
                    filter={bodyParts.knee.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('knee')}
                />
                <ellipse 
                    cx="124" cy="308" rx="14" ry="12"
                    fill={bodyParts.knee.color}
                    filter={bodyParts.knee.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('knee')}
                />

                {/* Calves */}
                <rect 
                    x="65" y="318" width="22" height="50" rx="10"
                    fill={bodyParts.calf.color}
                    filter={bodyParts.calf.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('calf')}
                />
                <rect 
                    x="113" y="318" width="22" height="50" rx="10"
                    fill={bodyParts.calf.color}
                    filter={bodyParts.calf.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('calf')}
                />

                {/* Ankles */}
                <ellipse 
                    cx="76" cy="372" rx="10" ry="8"
                    fill={bodyParts.ankle.color}
                    filter={bodyParts.ankle.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('ankle')}
                />
                <ellipse 
                    cx="124" cy="372" rx="10" ry="8"
                    fill={bodyParts.ankle.color}
                    filter={bodyParts.ankle.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('ankle')}
                />

                {/* Feet */}
                <ellipse 
                    cx="76" cy="388" rx="14" ry="8"
                    fill={bodyParts.foot.color}
                    filter={bodyParts.foot.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('foot')}
                />
                <ellipse 
                    cx="124" cy="388" rx="14" ry="8"
                    fill={bodyParts.foot.color}
                    filter={bodyParts.foot.risk > 0 ? "url(#glow)" : ""}
                    style={styles.bodyPart}
                    onClick={() => onBodyPartClick?.('foot')}
                />
            </svg>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        maxWidth: '200px',
        margin: '0 auto'
    },
    svg: {
        width: '100%',
        height: 'auto'
    },
    bodyPart: {
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }
};

export default HumanBody;
