import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import './MainPage.css';
import heroIllustration from '../assets/hero-illustration.png';
import { Activity, ArrowRight, Play, Clock, Brain, LayoutGrid, BarChart3, ClipboardList, Cpu, CalendarCheck, TrendingUp, UserRound, ShieldCheck, Stethoscope, X, ExternalLink, BookOpen, FileText, GraduationCap } from 'lucide-react';

const MainPage = () => {
    const navigate = useNavigate();
    const [showLearnMore, setShowLearnMore] = useState(false);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: stop observing once animated
                    // observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const targets = document.querySelectorAll('.animate-on-scroll, .animate-scale');
        targets.forEach(el => observer.observe(el));

        return () => targets.forEach(el => observer.unobserve(el));
    }, []);

    return (
        <div className="landing-page">
            <MainNavbar />

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

            {/* Built for Every Role Section */}
            <section className="roles-section">
                <div className="roles-container">
                    <span className="roles-subtitle">WHO IT'S FOR</span>
                    <h2 className="roles-title">Built for Every Role</h2>

                    <div className="roles-grid">
                        <div className="role-card animate-on-scroll stagger-delay-1">
                            <div className="role-icon-wrapper pulse-icon">
                                <UserRound size={28} />
                            </div>
                            <h3 className="role-card-title">Player</h3>
                            <p className="role-card-desc">Track your recovery progress and get personalized return-to-play timelines.</p>
                        </div>
                        <div className="role-card animate-on-scroll stagger-delay-2">
                            <div className="role-icon-wrapper pulse-icon">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="role-card-title">Coach</h3>
                            <p className="role-card-desc">Monitor team availability and plan training schedules around recovery data.</p>
                        </div>
                        <div className="role-card animate-on-scroll stagger-delay-3">
                            <div className="role-icon-wrapper pulse-icon">
                                <Stethoscope size={28} />
                            </div>
                            <h3 className="role-card-title">Medical Staff</h3>
                            <p className="role-card-desc">Access detailed injury analytics, set recovery milestones, and export medical reports.</p>
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
                            <a onClick={() => navigate('/features')} style={{ cursor: 'pointer' }}>Features</a>
                            <a onClick={() => navigate('/how-it-works')} style={{ cursor: 'pointer' }}>How It Works</a>
                            <a onClick={() => navigate('/reports')} style={{ cursor: 'pointer' }}>Reports</a>
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

