import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Cpu, CalendarCheck, TrendingUp } from 'lucide-react';
import MainNavbar from '../components/MainNavbar';
import './MainPage.css';

const HowItWorksPage = () => {
    // Unused navigate hook removed to pass linting

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
            <section className="how-it-works-section" id="how-it-works" style={{ paddingTop: '6rem', paddingBottom: '4rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="how-container">
                    <span className="how-subtitle">PROCESS</span>
                    <h2 className="how-title">How It Works</h2>

                    <div className="how-steps">
                        {steps.map((step, index) => (
                            <div className={`step-item animate-on-scroll stagger-delay-${(index % 4) + 1}`} key={index}>
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
        </div>
    );
};

export default HowItWorksPage;
