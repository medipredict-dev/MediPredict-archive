import React, { useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

const MainNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const navLinksRef = useRef(null);
    const highlightRef = useRef(null);

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

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <Activity className="brand-icon" size={24} />
                    <span className="brand-text">
                        Medi<span className="brand-highlight">Predict</span>
                    </span>
                </div>

                <div className="nav-links" ref={navLinksRef} onMouseLeave={handleNavLeave}>
                    <div className="nav-highlight" ref={highlightRef}></div>
                    <a className={location.pathname === '/' ? 'active' : ''} onClick={() => navigate('/')} onMouseEnter={handleLinkHover} style={{ cursor: 'pointer' }}>Home</a>
                    <a className={location.pathname === '/features' ? 'active' : ''} onClick={() => navigate('/features')} onMouseEnter={handleLinkHover} style={{ cursor: 'pointer' }}>Features</a>
                    <a className={location.pathname === '/how-it-works' ? 'active' : ''} onClick={() => navigate('/how-it-works')} onMouseEnter={handleLinkHover} style={{ cursor: 'pointer' }}>How It Works</a>
                    <a className={location.pathname === '/reports' ? 'active' : ''} onClick={() => navigate('/reports')} onMouseEnter={handleLinkHover} style={{ cursor: 'pointer' }}>Reports</a>
                    <a className={location.pathname === '/about-team' ? 'active' : ''} onClick={() => navigate('/about-team')} onMouseEnter={handleLinkHover} style={{ cursor: 'pointer' }}>About Team</a>
                </div>

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
    );
};

export default MainNavbar;
