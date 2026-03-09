import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Github } from 'lucide-react';
import MainNavbar from '../components/MainNavbar';
import './AboutTeam.css';

const teamMembers = [
    {
        name: 'Leena Sri K',
        roll: 'CB.SC.U4CSE23526',
        email: 'leenasri0110@gmail.com',
        phone: '8508555330',
        github: 'https://github.com/leena0110',
        initials: 'LK',
    },
    {
        name: 'Lavishka Dhamija',
        roll: 'CB.SC.U4CSE23527',
        email: 'lavishkadhamija@gmail.com',
        phone: '9817782840',
        github: 'https://github.com/LavishkaDhamija',
        initials: 'LD',
    },
    {
        name: 'Sanjana M',
        roll: 'CB.SC.U4CSE23528',
        email: 'sanjanamadhavan2005@gmail.com',
        phone: '7358471835',
        github: 'https://github.com/MSanjana041',
        initials: 'SM',
    },
];

const AboutTeam = () => {
    const navigate = useNavigate();

    return (
        <div className="about-team-page">
            {/* Navbar */}
            <MainNavbar />

            <div style={{ paddingTop: '6rem', paddingBottom: '4rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* Hero Header */}
                <section className="at-hero">
                    <span className="at-hero-label">OUR TEAM</span>
                    <h1 className="at-hero-title">
                        Meet the <span className="highlight">Team</span>
                    </h1>
                    <p className="at-hero-subtitle">
                        A passionate team of developers building AI-powered sports injury recovery predictions.
                    </p>
                </section>

                {/* Team Cards */}
                <div className="at-team-grid">
                    {teamMembers.map((member, index) => (
                        <div className="at-card" key={index}>
                            {/* Avatar */}
                            <div className="at-avatar">{member.initials}</div>

                            {/* Name & Roll */}
                            <h3 className="at-card-name">{member.name}</h3>
                            <p className="at-card-roll">{member.roll}</p>

                            {/* Info Rows */}
                            <div className="at-info-list">
                                <div className="at-info-row">
                                    <Mail size={15} className="at-info-icon" />
                                    <span>{member.email}</span>
                                </div>
                                <div className="at-info-row">
                                    <Phone size={15} className="at-info-icon" />
                                    <span>{member.phone}</span>
                                </div>
                            </div>

                            {/* GitHub Button */}
                            <a
                                href={member.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="at-github-btn"
                            >
                                <Github size={16} />
                                View GitHub
                            </a>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="at-footer" style={{ width: '100%' }}>
                    © 2026 MediPredict. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default AboutTeam;
