import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Brain, LayoutGrid, BarChart3 } from 'lucide-react';
import MainNavbar from '../components/MainNavbar';
import './MainPage.css';

const FeaturesPage = () => {
    // Unused navigate hook removed to pass linting

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

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
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
            <section className="features-section" id="features" style={{ paddingTop: '6rem', paddingBottom: '4rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="features-container">
                    <span className="features-subtitle">WHY MEDIPREDICT</span>
                    <h2 className="features-title">Smarter Recovery Starts Here</h2>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div className={`feature-card animate-on-scroll stagger-delay-${(index % 4) + 1}`} key={index}>
                                <div className="feature-icon-wrapper pulse-icon">
                                    {feature.icon}
                                </div>
                                <h3 className="feature-card-title">{feature.title}</h3>
                                <p className="feature-card-desc">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FeaturesPage;
