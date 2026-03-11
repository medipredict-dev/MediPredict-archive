import React from 'react';
// Removed unused useNavigate import
import MainNavbar from '../components/MainNavbar';
import './MainPage.css';

const ReportsPage = () => {
    // Unused navigate hook removed to pass linting

    return (
        <div className="landing-page">
            <MainNavbar />
            <section className="reports-section" id="reports" style={{ paddingTop: '6rem', paddingBottom: '4rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        </div>
    );
};

export default ReportsPage;
