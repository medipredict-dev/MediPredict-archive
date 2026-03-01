import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import doctorSilhouette from '../assets/silhouettes/doctor-silhouette.png';

const MedicalDashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [injuries, setInjuries] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedInjury, setSelectedInjury] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        playerId: '',
        injuryType: '',
        bodyPart: '',
        severity: 'Minor',
        status: 'Active',
        treatment: '',
        description: '',
        expectedRecoveryDays: '',
        notes: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        const isMedical = userData.roles?.some(role =>
            role.name === 'Medical' || role.name === 'Admin'
        );

        if (!isMedical) {
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

            const [statsRes, injuriesRes, playersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/medical/stats', config),
                axios.get('http://localhost:5000/api/medical/injuries', config),
                axios.get('http://localhost:5000/api/medical/players', config)
            ]);

            setStats(statsRes.data);
            setInjuries(injuriesRes.data);
            setPlayers(playersRes.data);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddInjury = async (e) => {
        e.preventDefault();
        try {
            const token = user?.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            console.log('Sending formData:', formData);
            await axios.post('http://localhost:5000/api/medical/injuries', formData, config);
            setShowAddModal(false);
            resetForm();
            setError('');
            fetchDashboardData(token);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to add injury';
            setError(errorMsg);
            console.error('Add injury error:', err.response?.data || err);
        }
    };

    const handleUpdateInjury = async (e) => {
        e.preventDefault();
        try {
            const token = user?.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.put(`http://localhost:5000/api/medical/injuries/${selectedInjury._id}`, formData, config);
            setShowEditModal(false);
            setSelectedInjury(null);
            resetForm();
            fetchDashboardData(token);
        } catch (err) {
            setError('Failed to update injury');
            console.error(err);
        }
    };

    const handleDeleteInjury = async (injuryId) => {
        if (!window.confirm('Are you sure you want to delete this injury record?')) return;

        try {
            const token = user?.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.delete(`http://localhost:5000/api/medical/injuries/${injuryId}`, config);
            fetchDashboardData(token);
        } catch (err) {
            setError('Failed to delete injury');
            console.error(err);
        }
    };

    const openEditModal = (injury) => {
        setSelectedInjury(injury);
        setFormData({
            playerId: injury.playerId?._id || '',
            injuryType: injury.injuryType || '',
            bodyPart: injury.bodyPart || '',
            severity: injury.severity || 'Minor',
            status: injury.status || 'Active',
            treatment: injury.treatment || '',
            description: injury.description || '',
            expectedRecoveryDays: injury.expectedRecoveryDays || injury.predictedRecoveryDays || '',
            notes: injury.notes || ''
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            playerId: '',
            injuryType: '',
            bodyPart: '',
            severity: 'Minor',
            status: 'Active',
            treatment: '',
            description: '',
            expectedRecoveryDays: '',
            notes: ''
        });
    };

    const getSeverityColor = (severity) => {
        const colors = {
            Minor: '#22c55e',
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

    if (loading) {
        return (
            <div className="dashboard-header">
                <div className="spinner"></div>
                <p>Loading Medical Dashboard...</p>
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
                        <span className="badge-lime" style={{ marginLeft: '1rem' }}>Medical Staff Dashboard</span>
                    </div>
                    <div>
                        <span style={{ marginRight: '1.5rem' }}>Welcome, {user?.name}</span>
                        <button onClick={handleLogout} className="button-primary">Logout</button>
                    </div>
                </div>
            </header>

            {error && <div style={{ color: 'red', textAlign: 'center', margin: '1rem 0' }}>{error}</div>}

            <main style={{ padding: '2rem' }}>
                {/* Welcome Section with Doctor Silhouette */}
                <section style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <img src={doctorSilhouette} alt="Medical Staff" style={{ width: 180, height: 'auto', marginRight: '2rem' }} />
                    <div>
                        <h2 style={{ color: 'var(--color-navy)', margin: 0 }}>Medical Staff Dashboard</h2>
                        <p style={{ color: 'var(--color-navy)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            Manage player injuries, track recovery progress, and maintain comprehensive medical records for the team.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setShowAddModal(true)} className="button-primary">
                                + Add New Injury Record
                            </button>
                            <button onClick={() => navigate('/predictions')} className="button-primary">
                                🤖 Open AI Prediction Module
                            </button>
                        </div>
                    </div>
                </section>

                {/* Stats Cards */}
                <section style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div className="stats-card">
                            <div style={{ fontWeight: 700, fontSize: '2rem' }}>{stats?.totalInjuries ?? '-'}</div>
                            <div>Total Injuries</div>
                        </div>
                        <div className="stats-card">
                            <div style={{ fontWeight: 700, fontSize: '2rem' }}>{stats?.activeInjuries ?? '-'}</div>
                            <div>Active</div>
                        </div>
                        <div className="stats-card">
                            <div style={{ fontWeight: 700, fontSize: '2rem' }}>{stats?.recoveringInjuries ?? '-'}</div>
                            <div>Recovering</div>
                        </div>
                        <div className="stats-card">
                            <div style={{ fontWeight: 700, fontSize: '2rem' }}>{stats?.healedInjuries ?? '-'}</div>
                            <div>Healed</div>
                        </div>
                    </div>
                </section>

                {/* Injury Records Table */}
                <section>
                    <h3 style={{ color: 'var(--color-navy)' }}>Injury Records</h3>
                    <div style={{ background: 'var(--color-white)', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', padding: '1rem', border: '1px solid var(--color-border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--color-gray)', borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Player</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Injury</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Body Part</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Severity</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Status</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Recovery Days</th>
                                    <th style={{ padding: '0.7rem', color: 'var(--color-muted)', fontWeight: '500' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {injuries.map(injury => (
                                    <tr key={injury._id} style={{ borderBottom: '1px solid var(--color-gray)' }}>
                                        <td style={{ padding: '0.7rem' }}>{injury.playerId?.name}</td>
                                        <td style={{ padding: '0.7rem' }}>{injury.injuryType}</td>
                                        <td style={{ padding: '0.7rem' }}>{injury.bodyPart}</td>
                                        <td style={{ padding: '0.7rem' }}>
                                            <span className="badge-lime">{injury.severity}</span>
                                        </td>
                                        <td style={{ padding: '0.7rem' }}>
                                            <span className="badge-lime">{injury.status}</span>
                                        </td>
                                        <td style={{ padding: '0.7rem' }}>{injury.predictedRecoveryDays ?? '-'}</td>
                                        <td style={{ padding: '0.7rem' }}>
                                            <button onClick={() => openEditModal(injury)} className="button-primary" style={{ marginRight: '0.5rem', padding: '0.3rem 1rem', background: 'transparent', color: 'var(--color-muted)', border: '1px solid var(--color-border)', boxShadow: 'none' }}>Edit</button>
                                            <button onClick={() => handleDeleteInjury(injury._id)} className="button-primary" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.3rem 1rem', boxShadow: 'none' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* Add Injury Modal */}
            {
                showAddModal && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <h2 style={styles.modalTitle}>Add New Injury Record</h2>
                            <form onSubmit={handleAddInjury}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Player</label>
                                    <select
                                        name="playerId"
                                        value={formData.playerId}
                                        onChange={handleInputChange}
                                        style={styles.select}
                                        required
                                    >
                                        <option value="">Select Player</option>
                                        {players.map(player => (
                                            <option key={player._id} value={player._id}>
                                                {player.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Injury Type</label>
                                        <select
                                            name="injuryType"
                                            value={formData.injuryType}
                                            onChange={handleInputChange}
                                            style={styles.select}
                                            required
                                        >
                                            <option value="">Select Injury Type</option>
                                            <option value="Muscle Strain">Muscle Strain</option>
                                            <option value="Ligament Sprain">Ligament Sprain</option>
                                            <option value="Fracture">Fracture</option>
                                            <option value="Concussion">Concussion</option>
                                            <option value="Tendinitis">Tendinitis</option>
                                            <option value="Dislocation">Dislocation</option>
                                            <option value="Contusion">Contusion</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Body Part</label>
                                        <select
                                            name="bodyPart"
                                            value={formData.bodyPart}
                                            onChange={handleInputChange}
                                            style={styles.select}
                                            required
                                        >
                                            <option value="">Select Body Part</option>
                                            <option value="Head">Head</option>
                                            <option value="Neck">Neck</option>
                                            <option value="Shoulder">Shoulder</option>
                                            <option value="Arm">Arm</option>
                                            <option value="Elbow">Elbow</option>
                                            <option value="Wrist">Wrist</option>
                                            <option value="Hand">Hand</option>
                                            <option value="Back">Back</option>
                                            <option value="Hip">Hip</option>
                                            <option value="Thigh">Thigh</option>
                                            <option value="Knee">Knee</option>
                                            <option value="Ankle">Ankle</option>
                                            <option value="Foot">Foot</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Severity</label>
                                        <select
                                            name="severity"
                                            value={formData.severity}
                                            onChange={handleInputChange}
                                            style={styles.select}
                                        >
                                            <option value="Minor">Minor</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Severe">Severe</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            style={styles.select}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Recovering">Recovering</option>
                                            <option value="Healed">Healed</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Description *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        style={styles.textarea}
                                        placeholder="Describe the injury in detail..."
                                        rows="2"
                                        required
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Treatment</label>
                                    <textarea
                                        name="treatment"
                                        value={formData.treatment}
                                        onChange={handleInputChange}
                                        style={styles.textarea}
                                        placeholder="Describe the treatment plan..."
                                        rows="3"
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Expected Recovery Days</label>
                                    <input
                                        type="number"
                                        name="expectedRecoveryDays"
                                        value={formData.expectedRecoveryDays}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        placeholder="e.g., 14"
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        style={styles.textarea}
                                        placeholder="Additional notes..."
                                        rows="2"
                                    />
                                </div>
                                <div style={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={() => { setShowAddModal(false); resetForm(); }}
                                        style={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" style={styles.submitBtn}>
                                        Add Injury
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Edit Injury Modal */}
            {
                showEditModal && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <h2 style={styles.modalTitle}>Edit Injury Record</h2>
                            <form onSubmit={handleUpdateInjury}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Player</label>
                                    <select
                                        name="playerId"
                                        value={formData.playerId}
                                        onChange={handleInputChange}
                                        style={styles.select}
                                        required
                                    >
                                        <option value="">Select Player</option>
                                        {players.map(player => (
                                            <option key={player._id} value={player._id}>
                                                {player.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Injury Type</label>
                                        <select
                                            name="injuryType"
                                            value={formData.injuryType}
                                            onChange={handleInputChange}
                                            style={styles.select}
                                            required
                                        >
                                            <option value="">Select Injury Type</option>
                                            <option value="Muscle Strain">Muscle Strain</option>
                                            <option value="Ligament Sprain">Ligament Sprain</option>
                                            <option value="Fracture">Fracture</option>
                                            <option value="Concussion">Concussion</option>
                                            <option value="Tendinitis">Tendinitis</option>
                                            <option value="Dislocation">Dislocation</option>
                                            <option value="Contusion">Contusion</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Body Part</label>
                                        <select
                                            name="bodyPart"
                                            value={formData.bodyPart}
                                            onChange={handleInputChange}
                                            style={styles.select}
                                            required
                                        >
                                            <option value="">Select Body Part</option>
                                            <option value="Head">Head</option>
                                            <option value="Neck">Neck</option>
                                            <option value="Shoulder">Shoulder</option>
                                            <option value="Arm">Arm</option>
                                            <option value="Elbow">Elbow</option>
                                            <option value="Wrist">Wrist</option>
                                            <option value="Hand">Hand</option>
                                            <option value="Back">Back</option>
                                            <option value="Hip">Hip</option>
                                            <option value="Thigh">Thigh</option>
                                            <option value="Knee">Knee</option>
                                            <option value="Ankle">Ankle</option>
                                            <option value="Foot">Foot</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Severity</label>
                                        <select
                                            name="severity"
                                            value={formData.severity}
                                            onChange={handleInputChange}
                                            style={styles.select}
                                        >
                                            <option value="Minor">Minor</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Severe">Severe</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            style={styles.select}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Recovering">Recovering</option>
                                            <option value="Healed">Healed</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Treatment</label>
                                    <textarea
                                        name="treatment"
                                        value={formData.treatment}
                                        onChange={handleInputChange}
                                        style={styles.textarea}
                                        rows="3"
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Expected Recovery Days</label>
                                    <input
                                        type="number"
                                        name="expectedRecoveryDays"
                                        value={formData.expectedRecoveryDays}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        style={styles.textarea}
                                        rows="2"
                                    />
                                </div>
                                <div style={styles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={() => { setShowEditModal(false); setSelectedInjury(null); resetForm(); }}
                                        style={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" style={styles.submitBtn}>
                                        Update Injury
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
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
        fontSize: '14px'
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
        margin: '0 0 25px 0',
        fontSize: '18px',
        color: '#94a3b8',
        lineHeight: '1.6'
    },
    addBtn: {
        backgroundColor: '#0ce88d',
        color: '#000',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(12, 232, 141, 0.2)'
    },
    statsSection: {
        marginBottom: '30px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
    tableSection: {
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
    tableContainer: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        textAlign: 'left',
        padding: '15px',
        backgroundColor: 'transparent',
        color: '#94a3b8',
        fontWeight: '600',
        fontSize: '14px',
        borderBottom: '2px solid #1e293b'
    },
    tr: {
        borderBottom: '1px solid #1e293b'
    },
    td: {
        padding: '15px',
        color: '#f8fafc'
    },
    emptyRow: {
        textAlign: 'center',
        padding: '40px',
        color: '#94a3b8'
    },
    playerCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    avatar: {
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        backgroundColor: '#131b26',
        border: '1px solid #0ce88d',
        color: '#0ce88d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    badge: {
        padding: '4px 10px',
        borderRadius: '15px',
        fontSize: '12px',
        fontWeight: '600'
    },
    actions: {
        display: 'flex',
        gap: '8px'
    },
    editBtn: {
        backgroundColor: 'transparent',
        color: '#94a3b8',
        border: 'none',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    deleteBtn: {
        backgroundColor: 'transparent',
        color: '#ef4444',
        border: 'none',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: '#131b26',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        padding: '30px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#f8fafc'
    },
    modalTitle: {
        margin: '0 0 25px 0',
        fontSize: '24px',
        color: '#0ce88d'
    },
    formGroup: {
        marginBottom: '20px',
        flex: 1
    },
    formRow: {
        display: 'flex',
        gap: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#94a3b8'
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #1e293b',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #1e293b',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    textarea: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #1e293b',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontSize: '14px',
        boxSizing: 'border-box',
        resize: 'vertical'
    },
    modalActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        marginTop: '25px'
    },
    cancelBtn: {
        backgroundColor: 'transparent',
        color: '#f8fafc',
        border: '1px solid #1e293b',
        padding: '12px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    submitBtn: {
        backgroundColor: '#0ce88d',
        color: '#000',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(12, 232, 141, 0.2)'
    }
};

// Add keyframes for spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default MedicalDashboard;
