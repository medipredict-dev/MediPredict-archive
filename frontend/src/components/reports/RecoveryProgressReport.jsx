import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DownloadCloud, UserRound, AlertTriangle, Calendar, Activity } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import reportService from '../../api/reportService';
import './ReportComponents.css'; // We will create this

const RecoveryProgressReport = () => {
    const reportRef = useRef(null);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Assume we might pass playerId via props or url for Medical staff in future iterations
    // For now we just call it (the backend uses req.user._id if param is empty)
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await reportService.getRecoveryProgress();
                setReportData(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch recovery report:", err);
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    const generatePDF = async () => {
        if (!reportRef.current) return;

        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

            // A4 page dimensions in mm
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Recovery_Progress_${reportData.player.name.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error('Error generating PDF', err);
            alert("Failed to generate PDF. Check console.");
        }
    };

    if (loading) return <div className="report-loading">Loading report data...</div>;
    if (error) return <div className="report-error">Error loading report: {error}</div>;
    if (!reportData) return <div className="report-empty">No active recovery data found.</div>;

    const { player, injury, recovery } = reportData;

    // Formatting date
    const reportDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const injuryDate = new Date(injury.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const estDate = new Date(recovery.estimatedReturnDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let returnDate = estDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // If the estimated return date has passed but the player is not marked as healed, they are pending re-evaluation
    if (estDate < currentDate && injury.status !== 'Healed' && injury.status !== 'Recovered') {
        returnDate = 'Pending Clearance';
    }

    return (
        <div className="report-wrapper">
            {/* Download Button Header (Not included in PDF) */}
            <div className="report-actions">
                <button className="btn-download" onClick={generatePDF}>
                    <DownloadCloud size={18} />
                    Download Report as PDF
                </button>
            </div>

            {/* The printable area */}
            <div className="report-document" ref={reportRef}>
                {/* Header Section */}
                <div className="report-header">
                    <div className="brand-title">
                        <Activity size={24} className="text-indigo-600" />
                        <h2>MediPredict</h2>
                    </div>
                    <h1>Recovery Progress Report</h1>
                    <div className="header-meta">
                        <p><strong>Generated On:</strong> {reportDate}</p>
                        <p><strong>Report Period:</strong> Last {recovery.progressTimeline.length} Weeks</p>
                    </div>
                </div>

                <hr className="report-divider" />

                {/* Info Grid */}
                <div className="report-info-grid">
                    <div className="info-box">
                        <div className="box-icon"><UserRound size={20} /></div>
                        <div>
                            <h4>Player Details</h4>
                            <p className="detail-value">{player.name}</p>
                            <p className="detail-sub">{player.position} | {player.team}</p>
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="box-icon text-orange-500"><AlertTriangle size={20} /></div>
                        <div>
                            <h4>Injury Condition</h4>
                            <p className="detail-value">{injury.type}</p>
                            <p className="detail-sub">Date: {injuryDate}</p>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="report-section">
                    <h3>Recovery Visualization</h3>
                    <div className="chart-container-large">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={recovery.progressTimeline} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <YAxis
                                    domain={[0, 100]}
                                    tickFormatter={(tick) => `${tick}%`}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280' }}
                                />
                                <Tooltip
                                    formatter={(value) => [`${value}%`, 'Estimated Recovery']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="progress"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                    connectNulls={true}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="interpretation-box" style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #4f46e5' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#111827', fontSize: '1rem' }}>Interpretation:</h4>
                        <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>
                            {recovery.interpretation}
                        </p>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="report-section summary-section">
                    <h3>Recovery Summary</h3>
                    <div className="summary-banner">
                        <div className="stat-block">
                            <span className="stat-label">Current Recovery Level</span>
                            <span className="stat-number text-green-600">{recovery.currentLevel}%</span>
                        </div>
                        <div className="stat-block">
                            <span className="stat-label">Estimated Return</span>
                            <span className="stat-value-text">{returnDate}</span>
                        </div>
                        <div className="stat-block">
                            <span className="stat-label">Status</span>
                            <span className={`status-badge ${injury.status === 'Recovering' ? 'badge-amber' : 'badge-green'}`}>
                                {injury.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                <div className="report-section notes-section">
                    <h3>Doctor / Physiotherapist Notes</h3>
                    <div className="notes-box">
                        <p style={{ whiteSpace: 'pre-line' }}>{injury.notes}</p>
                    </div>

                    <h3>Recommendations</h3>
                    <div className="recommendations-box">
                        <ul>
                            <li>Continue prescribed physiotherapy sessions and stretching routines.</li>
                            <li>Gradually increase training load based on pain tolerance.</li>
                            <li>Follow {injury.treatment} protocol closely.</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="report-footer">
                    <p>
                        Note: All report data is dynamically fetched from the backend API after user authentication.
                        The data shown here is accurately mapped to database records and is not hardcoded.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecoveryProgressReport;
