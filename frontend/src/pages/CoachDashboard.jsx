import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, LogOut, Users, HeartPulse, TrendingUp, Stethoscope, ChevronRight } from 'lucide-react';
import coachSilhouette from '../assets/silhouettes/coach-silhouette.png';
import './CoachDashboard.css';

const CoachDashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [players, setPlayers] = useState([]);
    const [injuries, setInjuries] = useState([]);
    const [trainingLoads, setTrainingLoads] = useState([]);
    const [tlFormData, setTlFormData] = useState({
        player: '',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        intensity: 'Medium',
        sleepHours: '',
        fatigueLevel: 5,
        notes: ''
    });
    const [tlDateRange, setTlDateRange] = useState({ startDate: '', endDate: '' });
    const [editingTlId, setEditingTlId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        const isCoach = userData.roles?.some(r => r.name === 'Coach' || r.name === 'Admin');
        if (!isCoach) { navigate('/dashboard'); return; }

        fetchDashboardData(userData.token);
    }, [navigate]);

    const fetchDashboardData = async (token) => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [statsRes, playersRes, injuriesRes, tlRes] = await Promise.all([
                axios.get('http://localhost:5000/api/coach/stats', config),
                axios.get('http://localhost:5000/api/coach/players', config),
                axios.get('http://localhost:5000/api/coach/injuries', config),
                axios.get('http://localhost:5000/api/training-load', config)
            ]);
            setStats(statsRes.data);
            setPlayers(playersRes.data);
            setInjuries(injuriesRes.data);
            setTrainingLoads(tlRes.data);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

    const fetchTrainingLoads = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            let url = 'http://localhost:5000/api/training-load';
            if (tlDateRange.startDate || tlDateRange.endDate) {
                const params = new URLSearchParams();
                if (tlDateRange.startDate) params.append('startDate', tlDateRange.startDate);
                if (tlDateRange.endDate) params.append('endDate', tlDateRange.endDate);
                url += `?${params.toString()}`;
            }
            const { data } = await axios.get(url, config);
            setTrainingLoads(data);
        } catch (err) { console.error('Failed to fetch training loads', err); }
    };

    const handleTlSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editingTlId) {
                await axios.put(`http://localhost:5000/api/training-load/${editingTlId}`, tlFormData, config);
            } else {
                await axios.post('http://localhost:5000/api/training-load', tlFormData, config);
            }
            setTlFormData({ ...tlFormData, duration: '', sleepHours: '', notes: '', fatigueLevel: 5 });
            setEditingTlId(null);
            fetchTrainingLoads();
        } catch (err) {
            console.error('Failed to save training load', err);
            alert('Failed to save training load');
        }
    };

    const handleTlDelete = async (id) => {
        if (!window.confirm('Delete this training record?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/training-load/${id}`, config);
            fetchTrainingLoads();
        } catch (err) { console.error('Failed to delete training load', err); }
    };

    const handleTlEditClick = (tl) => {
        setEditingTlId(tl._id);
        setTlFormData({
            player: tl.player?._id || tl.player,
            date: new Date(tl.date).toISOString().split('T')[0],
            duration: tl.duration,
            intensity: tl.intensity,
            sleepHours: tl.sleepHours,
            fatigueLevel: tl.fatigueLevel,
            notes: tl.notes || ''
        });
    };

    /* ── severity / status → badge class ── */
    const severityClass = (s) =>
        s === 'Mild' ? 'cd-badge cd-badge-green' :
            s === 'Moderate' ? 'cd-badge cd-badge-yellow' :
                s === 'Severe' || s === 'Critical' ? 'cd-badge cd-badge-red' :
                    'cd-badge cd-badge-teal';

    const statusClass = (s) =>
        s === 'Healed' ? 'cd-badge cd-badge-green' :
            s === 'Recovering' ? 'cd-badge cd-badge-yellow' :
                s === 'Active' ? 'cd-badge cd-badge-red' :
                    'cd-badge cd-badge-teal';

    const intensityClass = (i) =>
        i === 'High' ? 'cd-intensity cd-intensity-high' :
            i === 'Medium' ? 'cd-intensity cd-intensity-medium' :
                'cd-intensity cd-intensity-low';

    if (loading) {
        return (
            <div className="cd-loading">
                <div className="cd-spinner"></div>
                <p>Loading Coach Dashboard…</p>
            </div>
        );
    }

    return (
        <div className="cd-page">
            {/* ── Navbar ── */}
            <nav className="cd-nav">
                <div className="cd-nav-brand">
                    <Activity size={22} className="cd-brand-icon" />
                    <span className="cd-brand-text">
                        Medi<span className="cd-brand-highlight">Predict</span>
                    </span>
                    <span className="cd-nav-badge">Coach</span>
                </div>
                <div className="cd-nav-right">
                    <span className="cd-nav-welcome">Welcome, <strong>{user?.name}</strong></span>
                    <button className="cd-logout-btn" onClick={handleLogout}>
                        <LogOut size={15} /> Logout
                    </button>
                </div>
            </nav>

            <main className="cd-main">
                {error && <div className="cd-error">{error}</div>}

                {/* ── Page Header ── */}
                <div className="cd-header">
                    <img src={coachSilhouette} alt="Coach" className="cd-header-img" />
                    <div className="cd-header-text">
                        <p className="cd-section-label">COACH DASHBOARD</p>
                        <h1 className="cd-page-title">Team Overview</h1>
                        <p className="cd-page-subtitle">
                            Monitor your team's health and injury status.<br />
                            Track player recovery and manage team performance.
                        </p>
                    </div>
                </div>

                {/* ── Stats Grid ── */}
                <div className="cd-stats-grid">
                    <div className="cd-stat-card">
                        <div className="cd-stat-icon"><Users size={20} /></div>
                        <div>
                            <div className="cd-stat-val">{stats?.totalPlayers ?? '—'}</div>
                            <div className="cd-stat-lbl">Total Players</div>
                        </div>
                    </div>
                    <div className="cd-stat-card">
                        <div className="cd-stat-icon"><TrendingUp size={20} /></div>
                        <div>
                            <div className="cd-stat-val">{stats?.availablePlayers ?? '—'}</div>
                            <div className="cd-stat-lbl">Available</div>
                        </div>
                    </div>
                    <div className="cd-stat-card">
                        <div className="cd-stat-icon"><HeartPulse size={20} /></div>
                        <div>
                            <div className="cd-stat-val">{stats?.injuredPlayers ?? '—'}</div>
                            <div className="cd-stat-lbl">Injured</div>
                        </div>
                    </div>
                    <div className="cd-stat-card">
                        <div className="cd-stat-icon"><Stethoscope size={20} /></div>
                        <div>
                            <div className="cd-stat-val">{stats?.recoveringPlayers ?? '—'}</div>
                            <div className="cd-stat-lbl">Recovering</div>
                        </div>
                    </div>
                </div>

                {/* ── Team Players Table ── */}
                <h3 className="cd-section-title">Team Players</h3>
                <div className="cd-card">
                    <table className="cd-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Team</th>
                                <th>Position</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player => (
                                <tr key={player._id}>
                                    <td>{player.name}</td>
                                    <td>{player.team || '—'}</td>
                                    <td>{player.position || '—'}</td>
                                    <td>
                                        <span className="cd-badge cd-badge-green">
                                            {player.status || 'Unknown'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Current Injuries Table ── */}
                <h3 className="cd-section-title">Current Injuries</h3>
                <div className="cd-card">
                    <table className="cd-table">
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Injury</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th>Recovery Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {injuries.map(injury => (
                                <tr key={injury._id}>
                                    <td>{injury.playerId?.name}</td>
                                    <td>{injury.injuryType}</td>
                                    <td><span className={severityClass(injury.severity)}>{injury.severity}</span></td>
                                    <td><span className={statusClass(injury.status)}>{injury.status}</span></td>
                                    <td>{injury.predictedRecoveryDays ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Training Load Section ── */}
                <div className="cd-tl-section">
                    <h2 className="cd-tl-title">Training Load Management</h2>

                    <div className="cd-tl-body">
                        {/* Form */}
                        <div className="cd-tl-form-col">
                            <h3 className="cd-tl-form-title">
                                {editingTlId ? 'Edit Training Load' : 'Log Training Load'}
                            </h3>
                            <form onSubmit={handleTlSubmit}>
                                <label className="cd-tl-label">Player</label>
                                <select
                                    className="cd-tl-select"
                                    value={tlFormData.player}
                                    onChange={e => setTlFormData({ ...tlFormData, player: e.target.value })}
                                    required
                                >
                                    <option value="">Select a player</option>
                                    {players.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.name} ({p.position || 'Unknown'})
                                        </option>
                                    ))}
                                </select>

                                <div className="cd-tl-row">
                                    <div>
                                        <label className="cd-tl-label">Date</label>
                                        <input type="date" className="cd-tl-input"
                                            value={tlFormData.date}
                                            onChange={e => setTlFormData({ ...tlFormData, date: e.target.value })}
                                            required />
                                    </div>
                                    <div>
                                        <label className="cd-tl-label">Duration (mins)</label>
                                        <input type="number" className="cd-tl-input" min="1"
                                            value={tlFormData.duration}
                                            onChange={e => setTlFormData({ ...tlFormData, duration: e.target.value })}
                                            required />
                                    </div>
                                </div>

                                <div className="cd-tl-row">
                                    <div>
                                        <label className="cd-tl-label">Intensity</label>
                                        <select className="cd-tl-select"
                                            value={tlFormData.intensity}
                                            onChange={e => setTlFormData({ ...tlFormData, intensity: e.target.value })}
                                            required>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="cd-tl-label">Sleep (Hours)</label>
                                        <input type="number" className="cd-tl-input"
                                            min="0" max="24" step="0.5"
                                            value={tlFormData.sleepHours}
                                            onChange={e => setTlFormData({ ...tlFormData, sleepHours: e.target.value })}
                                            required />
                                    </div>
                                </div>

                                <label className="cd-tl-label">
                                    Fatigue Level:{' '}
                                    <strong style={{ color: 'hsl(160, 84%, 39%)' }}>{tlFormData.fatigueLevel}</strong> / 10
                                </label>
                                <input type="range" className="cd-tl-input"
                                    min="1" max="10"
                                    value={tlFormData.fatigueLevel}
                                    onChange={e => setTlFormData({ ...tlFormData, fatigueLevel: e.target.value })}
                                />

                                <label className="cd-tl-label">Notes</label>
                                <textarea className="cd-tl-textarea" rows="3"
                                    placeholder="Any additional observations…"
                                    value={tlFormData.notes}
                                    onChange={e => setTlFormData({ ...tlFormData, notes: e.target.value })}
                                />

                                <div className="cd-tl-btns">
                                    <button type="submit" className="cd-btn-primary">
                                        {editingTlId ? 'Update Record' : 'Save Record'}
                                    </button>
                                    {editingTlId && (
                                        <button type="button" className="cd-btn-secondary"
                                            onClick={() => {
                                                setEditingTlId(null);
                                                setTlFormData({ ...tlFormData, duration: '', sleepHours: '', notes: '', fatigueLevel: 5 });
                                            }}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Table */}
                        <div className="cd-tl-table-col">
                            <div className="cd-tl-table-header">
                                <h3 className="cd-tl-table-title">Training History</h3>
                                <div className="cd-filter-row">
                                    <input type="date" className="cd-filter-date"
                                        value={tlDateRange.startDate}
                                        onChange={e => setTlDateRange({ ...tlDateRange, startDate: e.target.value })}
                                        title="Start Date" />
                                    <span className="cd-filter-sep">to</span>
                                    <input type="date" className="cd-filter-date"
                                        value={tlDateRange.endDate}
                                        onChange={e => setTlDateRange({ ...tlDateRange, endDate: e.target.value })}
                                        title="End Date" />
                                    <button className="cd-btn-filter" onClick={fetchTrainingLoads}>
                                        Filter
                                    </button>
                                </div>
                            </div>

                            <table className="cd-tl-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Player</th>
                                        <th>Duration</th>
                                        <th>Intensity</th>
                                        <th>Fatigue</th>
                                        <th>Sleep</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trainingLoads.length === 0 ? (
                                        <tr><td colSpan="7" className="cd-tl-empty">No training records found.</td></tr>
                                    ) : trainingLoads.map(tl => (
                                        <tr key={tl._id}>
                                            <td>{new Date(tl.date).toLocaleDateString()}</td>
                                            <td>{tl.player?.name || 'Unknown'}</td>
                                            <td>{tl.duration}m</td>
                                            <td>
                                                <span className={intensityClass(tl.intensity)}>
                                                    {tl.intensity}
                                                </span>
                                            </td>
                                            <td>{tl.fatigueLevel}/10</td>
                                            <td>{tl.sleepHours}h</td>
                                            <td>
                                                <button className="cd-btn-edit" onClick={() => handleTlEditClick(tl)}>Edit</button>
                                                <button className="cd-btn-del" onClick={() => handleTlDelete(tl._id)}>Del</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ── Quick Access Reports ── */}
                <div className="cd-section" style={{ marginTop: '2rem' }}>
                    <h3 className="cd-section-title">Reports & Insights</h3>
                    <div className="cd-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        <button
                            className="cd-quick-report-card"
                            onClick={() => navigate('/report/team-availability')}
                        >
                            <div className="cd-quick-report-icon">
                                <Activity size={24} />
                            </div>
                            <div className="cd-quick-report-text">
                                <span className="cd-quick-report-title">Team Availability Report</span>
                                <span className="cd-quick-report-desc">View squad health charts & export to PDF</span>
                            </div>
                            <ChevronRight size={20} className="cd-quick-report-chevron" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CoachDashboard;
