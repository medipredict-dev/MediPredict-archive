import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import coachSilhouette from '../assets/silhouettes/coach-silhouette.png';

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

    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        const isCoach = userData.roles?.some(role =>
            role.name === 'Coach' || role.name === 'Admin'
        );

        if (!isCoach) {
            navigate('/dashboard');
            return;
        }

        fetchDashboardData(userData.token);
    }, [navigate]);

    const fetchDashboardData = async (token) => {
        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

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

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getSeverityColor = (severity) => {
        const colors = {
            Mild: '#22c55e',
            Moderate: '#eab308',
            Severe: '#f97316',
            Critical: '#dc2626'
        };
        return colors[severity] || '#6b7280';
    };

    const getStatusColor = (status) => {
        const colors = {
            Active: '#dc2626',
            Recovering: '#eab308',
            Healed: '#22c55e'
        };
        return colors[status] || '#6b7280';
    };

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
        } catch (err) {
            console.error('Failed to fetch training loads', err);
        }
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
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/training-load/${id}`, config);
            fetchTrainingLoads();
        } catch (err) {
            console.error('Failed to delete training load', err);
        }
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

    if (loading) {
        return (
            <div className="dashboard-header">
                <div className="spinner"></div>
                <p>Loading Coach Dashboard...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <header className="dashboard-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ margin: 0 }}>MediPredict</h1>
                        <span className="badge-lime" style={{ marginLeft: '1rem' }}>Coach Dashboard</span>
                    </div>
                    <div>
                        <span style={{ marginRight: '1.5rem' }}>Welcome, {user?.name}</span>
                        <button onClick={handleLogout} className="button-primary">Logout</button>
                    </div>
                </div>
            </header>

            {error && <div style={{ color: 'red', textAlign: 'center', margin: '1rem 0' }}>{error}</div>}

            <main style={{ padding: '2rem' }}>
                {/* Welcome Section with Coach Silhouette */}
                <section style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <img src={coachSilhouette} alt="Coach" style={{ width: 180, height: 'auto', marginRight: '2rem' }} />
                    <div>
                        <h2 style={{ color: 'var(--color-navy)', margin: 0 }}>Coach Dashboard</h2>
                        <p style={{ color: 'var(--color-navy)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            Monitor your team's health and injury status.<br />
                            Track player recovery and manage team performance.
                        </p>
                    </div>
                </section>

                {/* Stats Cards */}
                <section style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div className="stats-card">
                            <div style={{ fontWeight: 700, fontSize: '2rem' }}>{stats?.totalPlayers ?? '-'}</div>
                            <div>Total Players</div>
                        </div>
                        <div className="stats-card">
                            <div style={{ fontWeight: 700, fontSize: '2rem' }}>{stats?.availablePlayers ?? '-'}</div>
                            <div>Available</div>
                        </div>
                        <div className="stats-card">
                            <div style={{ fontWeight: 700, fontSize: '2rem' }}>{stats?.injuredPlayers ?? '-'}</div>
                            <div>Injured</div>
                        </div>
                        <div className="stats-card">
                            <div style={{ fontWeight: 700, fontSize: '2rem' }}>{stats?.recoveringPlayers ?? '-'}</div>
                            <div>Recovering</div>
                        </div>
                    </div>
                </section>

                {/* Team Players List */}
                <section style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--color-navy)' }}>Team Players</h3>
                    <div style={{ background: 'var(--color-white)', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', padding: '1rem', border: '1px solid var(--color-border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--color-gray)', borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Name</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Team</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Position</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map(player => (
                                    <tr key={player._id} style={{ borderBottom: '1px solid var(--color-gray)' }}>
                                        <td style={{ padding: '0.7rem' }}>{player.name}</td>
                                        <td style={{ padding: '0.7rem' }}>{player.team}</td>
                                        <td style={{ padding: '0.7rem' }}>{player.position}</td>
                                        <td style={{ padding: '0.7rem' }}>
                                            <span className="badge-lime">{player.status || "Unknown"}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Current Injuries */}
                <section>
                    <h3 style={{ color: 'var(--color-navy)' }}>Current Injuries</h3>
                    <div style={{ background: 'var(--color-white)', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', padding: '1rem', border: '1px solid var(--color-border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--color-gray)', borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Player</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Injury</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Severity</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Status</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Recovery Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {injuries.map(injury => (
                                    <tr key={injury._id} style={{ borderBottom: '1px solid var(--color-gray)' }}>
                                        <td style={{ padding: '0.7rem' }}>{injury.playerId?.name}</td>
                                        <td style={{ padding: '0.7rem' }}>{injury.injuryType}</td>
                                        <td style={{ padding: '0.7rem' }}>
                                            <span className="badge-lime">{injury.severity}</span>
                                        </td>
                                        <td style={{ padding: '0.7rem' }}>
                                            <span className="badge-lime">{injury.status}</span>
                                        </td>
                                        <td style={{ padding: '0.7rem' }}>{injury.predictedRecoveryDays ?? '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                {/* Training Load Section (Dark Theme) */}
                <section className="tl-section-dark">
                    <h2 style={{ color: 'hsl(160, 84%, 39%)', margin: '0 0 1.5rem 0', fontFamily: "'Space Grotesk', sans-serif" }}>
                        Training Load Management
                    </h2>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        {/* Form Column */}
                        <div className="tl-card-dark" style={{ flex: '1 1 350px' }}>
                            <h3 style={{ margin: '0 0 1rem 0', color: 'hsl(210, 20%, 92%)' }}>
                                {editingTlId ? 'Edit Training Load' : 'Log Training Load'}
                            </h3>
                            <form onSubmit={handleTlSubmit}>
                                <label className="tl-label-dark">Player ID (User)</label>
                                <select
                                    className="tl-input-dark"
                                    value={tlFormData.player}
                                    onChange={(e) => setTlFormData({ ...tlFormData, player: e.target.value })}
                                    required
                                >
                                    <option value="">Select a player</option>
                                    {players.map(p => (
                                        <option key={p._id} value={p._id}>{p.name} ({p.position || 'Unknown'})</option>
                                    ))}
                                </select>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="tl-label-dark">Date</label>
                                        <input
                                            type="date"
                                            className="tl-input-dark"
                                            value={tlFormData.date}
                                            onChange={(e) => setTlFormData({ ...tlFormData, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label className="tl-label-dark">Duration (mins)</label>
                                        <input
                                            type="number"
                                            className="tl-input-dark"
                                            value={tlFormData.duration}
                                            onChange={(e) => setTlFormData({ ...tlFormData, duration: e.target.value })}
                                            required
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="tl-label-dark">Intensity</label>
                                        <select
                                            className="tl-input-dark"
                                            value={tlFormData.intensity}
                                            onChange={(e) => setTlFormData({ ...tlFormData, intensity: e.target.value })}
                                            required
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label className="tl-label-dark">Sleep (Hours)</label>
                                        <input
                                            type="number"
                                            className="tl-input-dark"
                                            value={tlFormData.sleepHours}
                                            onChange={(e) => setTlFormData({ ...tlFormData, sleepHours: e.target.value })}
                                            required
                                            min="0"
                                            max="24"
                                            step="0.5"
                                        />
                                    </div>
                                </div>

                                <label className="tl-label-dark">
                                    Fatigue Level: <span style={{ color: 'hsl(160, 84%, 39%)' }}>{tlFormData.fatigueLevel}</span> / 10
                                </label>
                                <input
                                    type="range"
                                    className="tl-input-dark"
                                    min="1" max="10"
                                    value={tlFormData.fatigueLevel}
                                    onChange={(e) => setTlFormData({ ...tlFormData, fatigueLevel: e.target.value })}
                                    required
                                    style={{ padding: '0', height: '6px', accentColor: 'hsl(160, 84%, 39%)' }}
                                />

                                <label className="tl-label-dark">Notes</label>
                                <textarea
                                    className="tl-input-dark"
                                    value={tlFormData.notes}
                                    onChange={(e) => setTlFormData({ ...tlFormData, notes: e.target.value })}
                                    rows="3"
                                    placeholder="Any additional observations..."
                                />

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <button type="submit" className="tl-btn-primary">
                                        {editingTlId ? 'Update Record' : 'Save Record'}
                                    </button>
                                    {editingTlId && (
                                        <button
                                            type="button"
                                            className="tl-btn-danger"
                                            style={{ marginTop: '1.5rem', border: 'none' }}
                                            onClick={() => {
                                                setEditingTlId(null);
                                                setTlFormData({ ...tlFormData, duration: '', sleepHours: '', notes: '', fatigueLevel: 5 });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Table Column */}
                        <div className="tl-card-dark" style={{ flex: '2 1 500px', overflowX: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <h3 style={{ margin: 0, color: 'hsl(210, 20%, 92%)' }}>Training History</h3>

                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <input
                                        type="date" className="tl-input-dark" style={{ margin: 0, padding: '0.4rem' }}
                                        value={tlDateRange.startDate} onChange={e => setTlDateRange({ ...tlDateRange, startDate: e.target.value })}
                                        title="Start Date"
                                    />
                                    <span style={{ color: 'hsl(215, 15%, 55%)' }}>to</span>
                                    <input
                                        type="date" className="tl-input-dark" style={{ margin: 0, padding: '0.4rem' }}
                                        value={tlDateRange.endDate} onChange={e => setTlDateRange({ ...tlDateRange, endDate: e.target.value })}
                                        title="End Date"
                                    />
                                    <button onClick={fetchTrainingLoads} className="tl-btn-primary" style={{ padding: '0.4rem 1rem', margin: 0 }}>
                                        Filter
                                    </button>
                                </div>
                            </div>

                            <table className="tl-table-dark">
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
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', margin: '2rem 0', padding: '2rem', color: 'hsl(215, 15%, 55%)' }}>No training records found.</td>
                                        </tr>
                                    ) : (
                                        trainingLoads.map(tl => (
                                            <tr key={tl._id}>
                                                <td>{new Date(tl.date).toLocaleDateString()}</td>
                                                <td>{tl.player?.name || 'Unknown'}</td>
                                                <td>{tl.duration}m</td>
                                                <td>
                                                    <span style={{
                                                        color: tl.intensity === 'High' ? '#ef4444' : tl.intensity === 'Medium' ? '#eab308' : '#22c55e',
                                                        backgroundColor: tl.intensity === 'High' ? 'rgba(239,68,68,0.1)' : tl.intensity === 'Medium' ? 'rgba(234,179,8,0.1)' : 'rgba(34,197,94,0.1)',
                                                        padding: '0.2rem 0.5rem',
                                                        borderRadius: '0.25rem',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {tl.intensity}
                                                    </span>
                                                </td>
                                                <td>{tl.fatigueLevel}/10</td>
                                                <td>{tl.sleepHours}h</td>
                                                <td>
                                                    <button onClick={() => handleTlEditClick(tl)} className="tl-btn-edit">Edit</button>
                                                    <button onClick={() => handleTlDelete(tl._id)} className="tl-btn-danger">Del</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0b0f19',
        fontFamily: "'Inter', system-ui, sans-serif"
    },
    loadingContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0b0f19'
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #1e293b',
        borderTop: '4px solid #0ce88d',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    loadingText: {
        marginTop: '20px',
        color: '#94a3b8',
        fontSize: '18px'
    },
    header: {
        backgroundColor: '#131b26',
        color: '#f8fafc',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        borderBottom: '1px solid #1e293b'
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    logo: {
        margin: 0,
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#0ce88d'
    },
    roleTag: {
        backgroundColor: 'rgba(12, 232, 141, 0.1)',
        color: '#0ce88d',
        border: '1px solid #0ce88d',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '14px'
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    welcomeText: {
        fontSize: '16px',
        color: '#f8fafc'
    },
    logoutBtn: {
        backgroundColor: 'transparent',
        color: '#f8fafc',
        border: '1px solid #1e293b',
        padding: '8px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.3s'
    },
    error: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        border: '1px solid #ef4444',
        padding: '15px',
        margin: '20px 30px',
        borderRadius: '8px',
        textAlign: 'center'
    },
    main: {
        padding: '30px',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    welcomeSection: {
        backgroundColor: '#131b26',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
    },
    welcomeContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '40px'
    },
    welcomeText2: {
        flex: 1
    },
    welcomeTitle: {
        margin: '0 0 15px 0',
        fontSize: '32px',
        color: '#0ce88d'
    },
    welcomeSubtitle: {
        margin: 0,
        fontSize: '18px',
        color: '#94a3b8',
        lineHeight: '1.6'
    },
    statsSection: {
        marginBottom: '30px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
    },
    statCard: {
        backgroundColor: '#131b26',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
    },
    statIcon: {
        fontSize: '40px'
    },
    statInfo: {},
    statValue: {
        margin: '0 0 5px 0',
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#f8fafc'
    },
    statLabel: {
        margin: 0,
        fontSize: '14px',
        color: '#94a3b8'
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '30px'
    },
    card: {
        backgroundColor: '#131b26',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        padding: '25px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
    },
    cardTitle: {
        margin: '0 0 20px 0',
        fontSize: '20px',
        color: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    playersList: {
        maxHeight: '400px',
        overflowY: 'auto'
    },
    emptyText: {
        textAlign: 'center',
        color: '#94a3b8',
        padding: '40px'
    },
    playerItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        borderRadius: '10px',
        cursor: 'pointer',
        marginBottom: '10px',
        transition: 'background-color 0.2s',
        border: '1px solid #1e293b'
    },
    playerAvatar: {
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        backgroundColor: '#131b26',
        border: '1px solid #0ce88d',
        color: '#0ce88d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '18px'
    },
    playerInfo: {
        flex: 1,
        marginLeft: '15px'
    },
    playerName: {
        margin: '0 0 3px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#f8fafc'
    },
    playerRole: {
        margin: 0,
        fontSize: '13px',
        color: '#94a3b8'
    },
    statusBadge: {
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
    },
    injuriesList: {
        maxHeight: '400px',
        overflowY: 'auto'
    },
    injuryItem: {
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #1e293b',
        marginBottom: '15px'
    },
    injuryHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    injuryPlayer: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '600',
        color: '#f8fafc'
    },
    severityBadge: {
        padding: '4px 10px',
        borderRadius: '15px',
        fontSize: '12px',
        fontWeight: '600'
    },
    injuryType: {
        margin: '0 0 5px 0',
        fontSize: '15px',
        color: '#f8fafc',
        fontWeight: '500'
    },
    injuryBody: {
        margin: '0 0 10px 0',
        fontSize: '14px',
        color: '#94a3b8'
    },
    injuryFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statusPill: {
        padding: '4px 10px',
        borderRadius: '15px',
        fontSize: '12px',
        fontWeight: '600'
    },
    recoveryDays: {
        fontSize: '13px',
        color: '#94a3b8'
    },
    playerDetails: {
        backgroundColor: '#131b26',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        padding: '25px',
        marginTop: '30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
    },
    detailItem: {
        display: 'flex',
        flexDirection: 'column'
    },
    detailLabel: {
        fontSize: '13px',
        color: '#94a3b8',
        marginBottom: '5px'
    },
    detailValue: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#f8fafc'
    },
    closeBtn: {
        backgroundColor: 'transparent',
        color: '#f8fafc',
        border: '1px solid #1e293b',
        padding: '10px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    }
};

// Add keyframes for spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .tl-section-dark {
        background-color: hsl(220, 20%, 7%);
        color: hsl(210, 20%, 92%);
        padding: 2rem;
        border-radius: 1rem;
        margin-top: 3rem;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .tl-card-dark {
        background-color: hsl(220, 18%, 10%);
        border: 1px solid hsl(220, 14%, 18%);
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
    }
    .tl-input-dark {
        background-color: hsl(220, 16%, 12%);
        border: 1px solid hsl(220, 14%, 18%);
        color: hsl(210, 20%, 92%);
        padding: 0.75rem;
        border-radius: 0.5rem;
        width: 100%;
        margin-top: 0.5rem;
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    .tl-input-dark:focus {
        outline: none;
        border-color: hsl(160, 84%, 39%);
        box-shadow: 0 0 0 1px hsl(160, 84%, 39%);
    }
    .tl-label-dark {
        font-size: 0.9rem;
        color: hsl(215, 15%, 55%);
        font-weight: 500;
        display: block;
        margin-top: 1.2rem;
    }
    .tl-btn-primary {
        background: hsl(160, 84%, 39%);
        color: hsl(220, 20%, 7%);
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1.5rem;
        transition: all 0.2s;
        box-shadow: 0 0 20px -5px hsla(160, 84%, 39%, 0.3);
    }
    .tl-btn-primary:hover {
        background: hsl(160, 84%, 35%);
        transform: translateY(-2px);
        box-shadow: 0 0 25px -5px hsla(160, 84%, 39%, 0.5);
    }
    .tl-btn-danger {
        background: transparent;
        color: #ef4444;
        border: 1px solid #ef4444;
        padding: 0.4rem 0.8rem;
        border-radius: 0.4rem;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
    }
    .tl-btn-danger:hover {
        background: rgba(239,68,68,0.1);
    }
    .tl-btn-edit {
        background: transparent;
        color: hsl(160, 84%, 39%);
        border: 1px solid hsl(160, 84%, 39%);
        padding: 0.4rem 0.8rem;
        border-radius: 0.4rem;
        cursor: pointer;
        margin-right: 0.5rem;
        transition: all 0.2s;
        font-weight: 500;
    }
    .tl-btn-edit:hover {
        background: hsla(160, 84%, 39%, 0.1);
    }
    .tl-table-dark {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1.5rem;
        font-size: 0.95rem;
    }
    .tl-table-dark th {
        text-align: left;
        padding: 1rem;
        border-bottom: 2px solid hsl(220, 14%, 18%);
        color: hsl(215, 15%, 55%);
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.05em;
    }
    .tl-table-dark td {
        padding: 1rem;
        border-bottom: 1px solid hsl(220, 14%, 22%);
        color: hsl(210, 20%, 85%);
    }
    .tl-table-dark tr:hover {
        background-color: hsla(220, 16%, 15%, 0.8);
    }
`;
document.head.appendChild(styleSheet);

export default CoachDashboard;
