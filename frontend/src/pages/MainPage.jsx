import React, { useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import heroIllustration from '../assets/hero-illustration.png';
import { Activity, ArrowRight, Play, Clock, Brain, LayoutGrid, BarChart3, ClipboardList, Cpu, CalendarCheck, TrendingUp, UserRound, ShieldCheck, Stethoscope, X, ExternalLink, BookOpen, FileText, GraduationCap } from 'lucide-react';

const MainPage = () => {
    const navigate = useNavigate();
    const navLinksRef = useRef(null);
    const highlightRef = useRef(null);
    const [showLearnMore, setShowLearnMore] = useState(false);

    const handleLinkHover = useCallback((e) => {
        const link = e.currentTarget;
        const container = navLinksRef.current;
        const highlight = highlightRef.current;
        if (!container || !highlight) return;

        const containerRect = container.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        highlight.style.width = `${linkRect.width + 16}px`;
        highlight.style.left = `${linkRect.left - containerRect.left - 8}px`;
        highlight.style.opacity = '1';
    }, []);

    const handleNavLeave = useCallback(() => {
        const highlight = highlightRef.current;
        if (highlight) {
            highlight.style.opacity = '0';
        }
    }, []);

    const features = [
        {
            icon: <Clock size={22} />,
            title: 'Personalized Recovery Timeline',
            description: 'Tailored recovery schedules based on individual player data and injury severity.',
        },
        {
            icon: <Brain size={22} />,
            title: 'AI-Based Prediction Engine',
            description: 'Machine learning models trained on thousands of sports injury cases.',
        },
        {
            icon: <LayoutGrid size={22} />,
            title: 'Role-Based Dashboards',
            description: 'Custom views for players, coaches, and medical staff with relevant insights.',
        },
        {
            icon: <BarChart3 size={22} />,
            title: 'Injury Analytics & Reports',
            description: 'Comprehensive analytics with exportable reports for data-driven decisions.',
        },
    ];

    const steps = [
        {
            icon: <ClipboardList size={24} />,
            number: 1,
            title: 'Enter Injury Details',
            description: 'Input injury type, severity, and player history.',
        },
        {
            icon: <Cpu size={24} />,
            number: 2,
            title: 'AI Model Processes Data',
            description: 'Our engine analyzes patterns from thousands of cases.',
        },
        {
            icon: <CalendarCheck size={24} />,
            number: 3,
            title: 'Receive Recovery Timeline',
            description: 'Get a personalized, evidence-based recovery plan.',
        },
        {
            icon: <TrendingUp size={24} />,
            number: 4,
            title: 'Plan Training & Matches',
            description: 'Optimize return-to-play with actionable insights.',
        },
    ];

    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Logo */}
                    <div className="navbar-brand">
                        <Activity className="brand-icon" size={24} />
                        <span className="brand-text">
                            Medi<span className="brand-highlight">Predict</span>
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="nav-links" ref={navLinksRef} onMouseLeave={handleNavLeave}>
                        <div className="nav-highlight" ref={highlightRef}></div>
                        <a href="#home" onMouseEnter={handleLinkHover}>Home</a>
                        <a href="#features" onMouseEnter={handleLinkHover}>Features</a>
                        <a href="#how-it-works" onMouseEnter={handleLinkHover}>How It Works</a>
                        <a href="#reports" onMouseEnter={handleLinkHover}>Reports</a>
                        <a onClick={() => navigate('/about-team')} onMouseEnter={handleLinkHover} style={{ cursor: 'pointer' }}>About Team</a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="nav-actions">
                        <button className="btn-signin" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
                        <button className="btn-signup" onClick={() => navigate('/register')}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    {/* Left Content */}
                    <div className="hero-content">
                        {/* Badge */}
                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            AI-Powered Recovery Prediction
                        </div>

                        {/* Headline */}
                        <h1 className="hero-title">
                            Predict Recovery.<br />
                            <span className="title-highlight">Plan Performance.</span>
                        </h1>

                        {/* Description */}
                        <p className="hero-description">
                            MediPredict analyzes injury data, player history, and training load to generate personalized recovery timelines — empowering smarter return-to-play decisions.
                        </p>

                        {/* CTA Buttons */}
                        <div className="hero-buttons">
                            <button className="btn-primary" onClick={() => navigate('/register')}>
                                Get Started
                                <ArrowRight size={18} />
                            </button>
                            <button className="btn-secondary" onClick={() => setShowLearnMore(true)}>
                                <Play size={18} />
                                Learn More
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-value">95%</div>
                                <div className="stat-label">Prediction Accuracy</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-value">3x</div>
                                <div className="stat-label">Faster Recovery Plans</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-value">500+</div>
                                <div className="stat-label">Athletes Monitored</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="hero-visual">
                        <img
                            src={heroIllustration}
                            alt="AI-Powered Recovery Analytics"
                            className="hero-image"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="features-container">
                    <span className="features-subtitle">WHY MEDIPREDICT</span>
                    <h2 className="features-title">Smarter Recovery Starts Here</h2>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div className="feature-card" key={index}>
                                <div className="feature-icon-wrapper">
                                    {feature.icon}
                                </div>
                                <h3 className="feature-card-title">{feature.title}</h3>
                                <p className="feature-card-desc">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section" id="how-it-works">
                <div className="how-container">
                    <span className="how-subtitle">PROCESS</span>
                    <h2 className="how-title">How It Works</h2>

                    <div className="how-steps">
                        {steps.map((step, index) => (
                            <div className="step-item" key={index}>
                                <div className="step-icon-ring">
                                    {step.icon}
                                    <span className="step-number">{step.number}</span>
                                </div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-desc">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Built for Every Role Section */}
            <section className="roles-section">
                <div className="roles-container">
                    <span className="roles-subtitle">WHO IT'S FOR</span>
                    <h2 className="roles-title">Built for Every Role</h2>

                    <div className="roles-grid">
                        <div className="role-card">
                            <div className="role-icon-wrapper">
                                <UserRound size={28} />
                            </div>
                            <h3 className="role-card-title">Player</h3>
                            <p className="role-card-desc">Track your recovery progress and get personalized return-to-play timelines.</p>
                        </div>
                        <div className="role-card">
                            <div className="role-icon-wrapper">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="role-card-title">Coach</h3>
                            <p className="role-card-desc">Monitor team availability and plan training schedules around recovery data.</p>
                        </div>
                        <div className="role-card">
                            <div className="role-icon-wrapper">
                                <Stethoscope size={28} />
                            </div>
                            <h3 className="role-card-title">Medical Staff</h3>
                            <p className="role-card-desc">Access detailed injury analytics, set recovery milestones, and export medical reports.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reports & Insights Section */}
            <section className="reports-section" id="reports">
                <div className="reports-container">
                    <span className="reports-subtitle">ANALYTICS</span>
                    <h2 className="reports-title">Reports &amp; Insights</h2>

                    <div className="reports-grid">
                        {/* Recovery Progress - Line Chart */}
                        <div className="report-card">
                            <h3 className="report-card-title">Recovery Progress</h3>
                            <p className="report-card-desc">Player recovery trajectory over 6 weeks</p>
                            <div className="chart-area">
                                <svg viewBox="0 0 400 200" className="line-chart">
                                    {/* Y-axis labels */}
                                    <text x="25" y="25" className="chart-label">100</text>
                                    <text x="30" y="70" className="chart-label">75</text>
                                    <text x="30" y="115" className="chart-label">50</text>
                                    <text x="30" y="160" className="chart-label">25</text>
                                    <text x="38" y="198" className="chart-label">0</text>

                                    {/* Grid lines */}
                                    <line x1="55" y1="20" x2="390" y2="20" className="chart-grid" />
                                    <line x1="55" y1="65" x2="390" y2="65" className="chart-grid" />
                                    <line x1="55" y1="110" x2="390" y2="110" className="chart-grid" />
                                    <line x1="55" y1="155" x2="390" y2="155" className="chart-grid" />
                                    <line x1="55" y1="195" x2="390" y2="195" className="chart-grid" />

                                    {/* Line path */}
                                    <polyline
                                        points="75,175 140,148 205,115 270,95 335,60 390,22"
                                        className="chart-line"
                                    />

                                    {/* Data points */}
                                    <circle cx="75" cy="175" r="4" className="chart-dot" />
                                    <circle cx="140" cy="148" r="4" className="chart-dot" />
                                    <circle cx="205" cy="115" r="4" className="chart-dot" />
                                    <circle cx="270" cy="95" r="4" className="chart-dot" />
                                    <circle cx="335" cy="60" r="4" className="chart-dot" />
                                    <circle cx="390" cy="22" r="4" className="chart-dot" />

                                    {/* X-axis labels */}
                                    <text x="65" y="215" className="chart-label">Week 1</text>
                                    <text x="127" y="215" className="chart-label">Week 2</text>
                                    <text x="192" y="215" className="chart-label">Week 3</text>
                                    <text x="257" y="215" className="chart-label">Week 4</text>
                                    <text x="322" y="215" className="chart-label">Week 5</text>
                                    <text x="377" y="215" className="chart-label">Week 6</text>
                                </svg>
                            </div>
                        </div>

                        {/* Team Availability - Bar Chart */}
                        <div className="report-card">
                            <h3 className="report-card-title">Team Availability</h3>
                            <p className="report-card-desc">Current squad status overview</p>
                            <div className="chart-area">
                                <svg viewBox="0 0 400 220" className="bar-chart">
                                    {/* Y-axis labels */}
                                    <text x="30" y="25" className="chart-label">20</text>
                                    <text x="30" y="70" className="chart-label">15</text>
                                    <text x="30" y="115" className="chart-label">10</text>
                                    <text x="35" y="160" className="chart-label">5</text>
                                    <text x="35" y="200" className="chart-label">0</text>

                                    {/* Grid lines */}
                                    <line x1="55" y1="20" x2="390" y2="20" className="chart-grid" />
                                    <line x1="55" y1="65" x2="390" y2="65" className="chart-grid" />
                                    <line x1="55" y1="110" x2="390" y2="110" className="chart-grid" />
                                    <line x1="55" y1="155" x2="390" y2="155" className="chart-grid" />
                                    <line x1="55" y1="197" x2="390" y2="197" className="chart-grid" />

                                    {/* Bars */}
                                    <rect x="80" y="30" width="50" height="167" rx="4" className="chart-bar bar-available" />
                                    <rect x="165" y="155" width="50" height="42" rx="4" className="chart-bar bar-recovering" />
                                    <rect x="250" y="165" width="50" height="32" rx="4" className="chart-bar bar-injured" />
                                    <rect x="335" y="140" width="50" height="57" rx="4" className="chart-bar bar-cleared" />

                                    {/* X-axis labels */}
                                    <text x="85" y="215" className="chart-label">Available</text>
                                    <text x="163" y="215" className="chart-label">Recovering</text>
                                    <text x="258" y="215" className="chart-label">Injured</text>
                                    <text x="345" y="215" className="chart-label">Cleared</text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        {/* Brand Column */}
                        <div className="footer-brand-col">
                            <div className="navbar-brand">
                                <Activity className="brand-icon" size={24} />
                                <span className="brand-text">
                                    Medi<span className="brand-highlight">Predict</span>
                                </span>
                            </div>
                            <p className="footer-tagline">
                                AI-powered sports injury recovery prediction for smarter return-to-play decisions.
                            </p>
                        </div>

                        {/* Product Links */}
                        <div className="footer-link-col">
                            <h4 className="footer-col-title">Product</h4>
                            <a href="#features">Features</a>
                            <a href="#how-it-works">How It Works</a>
                            <a href="#reports">Reports</a>
                            <a href="#">Pricing</a>
                        </div>

                        {/* Company Links */}
                        <div className="footer-link-col">
                            <h4 className="footer-col-title">Company</h4>
                            <a onClick={() => navigate('/about-team')} style={{ cursor: 'pointer' }}>About Team</a>
                            <a href="#">Careers</a>
                            <a href="#">Contact</a>
                            <a href="#">Blog</a>
                        </div>

                        {/* Legal Links */}
                        <div className="footer-link-col">
                            <h4 className="footer-col-title">Legal</h4>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <span>© 2026 MediPredict. All rights reserved.</span>
                        <span>Built with AI for sports medicine professionals.</span>
                    </div>
                </div>
            </footer>

            {/* Learn More Modal */}
            {showLearnMore && (
                <div className="learn-more-overlay" onClick={() => setShowLearnMore(false)}>
                    <div className="learn-more-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="learn-more-close" onClick={() => setShowLearnMore(false)}>
                            <X size={24} />
                        </button>
                        
                        <div className="learn-more-header">
                            <BookOpen className="learn-more-icon" size={40} />
                            <h2>Research & Resources</h2>
                            <p>Explore the science behind sports injury prediction</p>
                        </div>

                        <div className="learn-more-content">
                            <div className="articles-section">
                                <h3><GraduationCap size={20} /> Academic Research</h3>
                                
                                <a href="https://pubmed.ncbi.nlm.nih.gov/?term=machine+learning+sports+injury+prediction" target="_blank" rel="noopener noreferrer" className="article-card">
                                    <div className="article-info">
                                        <h4>Machine Learning in Sports Injury Prediction</h4>
                                        <p>Browse peer-reviewed research on ML approaches for predicting sports injuries, analyzing training load, biomechanics, and athlete history.</p>
                                        <span className="article-source">PubMed - National Library of Medicine</span>
                                    </div>
                                    <ExternalLink size={18} className="article-link-icon" />
                                </a>

                                <a href="https://bjsm.bmj.com/" target="_blank" rel="noopener noreferrer" className="article-card">
                                    <div className="article-info">
                                        <h4>British Journal of Sports Medicine</h4>
                                        <p>Leading peer-reviewed journal covering sports medicine, injury prevention, and return-to-play protocols for athletes.</p>
                                        <span className="article-source">BMJ Publishing Group</span>
                                    </div>
                                    <ExternalLink size={18} className="article-link-icon" />
                                </a>

                                <a href="https://www.frontiersin.org/journals/sports-and-active-living" target="_blank" rel="noopener noreferrer" className="article-card">
                                    <div className="article-info">
                                        <h4>Frontiers in Sports and Active Living</h4>
                                        <p>Open-access journal publishing research on sports science, athlete performance, and injury rehabilitation.</p>
                                        <span className="article-source">Frontiers Media</span>
                                    </div>
                                    <ExternalLink size={18} className="article-link-icon" />
                                </a>
                            </div>

                            <div className="articles-section">
                                <h3><FileText size={20} /> Industry Resources</h3>
                                
                                <a href="https://www.acsm.org/" target="_blank" rel="noopener noreferrer" className="article-card">
                                    <div className="article-info">
                                        <h4>American College of Sports Medicine</h4>
                                        <p>World's largest sports medicine organization providing guidelines, certifications, and research on athlete health.</p>
                                        <span className="article-source">ACSM</span>
                                    </div>
                                    <ExternalLink size={18} className="article-link-icon" />
                                </a>

                                <a href="https://sportsmedres.org/" target="_blank" rel="noopener noreferrer" className="article-card">
                                    <div className="article-info">
                                        <h4>Sports Medicine Research</h4>
                                        <p>Evidence-based summaries of sports medicine research for clinicians and healthcare professionals.</p>
                                        <span className="article-source">SMR</span>
                                    </div>
                                    <ExternalLink size={18} className="article-link-icon" />
                                </a>

                                <a href="https://www.jospt.org/" target="_blank" rel="noopener noreferrer" className="article-card">
                                    <div className="article-info">
                                        <h4>Journal of Orthopaedic & Sports Physical Therapy</h4>
                                        <p>Clinical research on musculoskeletal conditions, rehabilitation protocols, and return-to-sport guidelines.</p>
                                        <span className="article-source">JOSPT</span>
                                    </div>
                                    <ExternalLink size={18} className="article-link-icon" />
                                </a>
                            </div>
                        </div>

                        <div className="learn-more-footer">
                            <button className="btn-primary" onClick={() => { setShowLearnMore(false); navigate('/register'); }}>
                                Get Started <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainPage;

