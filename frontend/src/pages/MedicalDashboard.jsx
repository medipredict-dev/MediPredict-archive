import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Activity, LogOut, Stethoscope, HeartPulse,
    ShieldAlert, CheckCircle, PlusCircle, Bot, Search, X
} from 'lucide-react';
import doctorSilhouette from '../assets/silhouettes/doctor-silhouette.png';
import './MedicalDashboard.css';

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

    // ── Search state ──
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [formData, setFormData] = useState({
        playerId: '',
        injuryType: '',
        bodyPart: '',
        severity: 'Minor',
        status: 'Active',
        treatment: '',
        description: '',
        expectedRecoveryDays: '',
        notes: '',
        treatedBy: '',
        painLevel: 5,
        clearedForTraining: false,
        dateOfInjury: new Date().toISOString().split('T')[0]
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        const isMedical = userData.roles?.some(r => r.name === 'Medical' || r.name === 'Admin');
        if (!isMedical) { navigate('/dashboard'); return; }

        fetchDashboardData(userData.token);
    }, [navigate]);

    const fetchDashboardData = async (token) => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
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

    const handleLogout = () => { localStorage.removeItem('user'); navigate('/login'); };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        // Parse number fields so they are stored as numbers, not strings
        const parsed = type === 'range' || type === 'number' ? Number(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsed }));
    };

    const handleAddInjury = async (e) => {
        e.preventDefault();
        try {
            const token = user?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
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
            const config = { headers: { Authorization: `Bearer ${token}` } };
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
        if (!window.confirm('Delete this injury record?')) return;
        try {
            const token = user?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
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
            notes: injury.notes || '',
            treatedBy: injury.treatedBy || '',
            painLevel: injury.painLevel || 5,
            clearedForTraining: injury.clearedForTraining || false,
            dateOfInjury: injury.dateOfInjury
                ? new Date(injury.dateOfInjury).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            playerId: '', injuryType: '', bodyPart: '',
            severity: 'Minor', status: 'Active',
            treatment: '', description: '', expectedRecoveryDays: '', notes: '',
            treatedBy: '', painLevel: 5, clearedForTraining: false,
            dateOfInjury: new Date().toISOString().split('T')[0]
        });
    };

    /* ── Filtered injuries (client-side, instant) ── */
    const filteredInjuries = injuries.filter(inj => {
        const nameMatch = !searchQuery || inj.playerId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const typeMatch = !filterType || inj.injuryType === filterType;
        const statusMatch = !filterStatus || inj.status === filterStatus;
        return nameMatch && typeMatch && statusMatch;
    });

    /* ── badge helpers ── */
    const severityClass = (s) =>
        s === 'Minor' ? 'md-badge md-badge-green' :
            s === 'Moderate' ? 'md-badge md-badge-yellow' :
                'md-badge md-badge-red';

    const statusClass = (s) =>
        s === 'Healed' ? 'md-badge md-badge-green' :
            s === 'Recovering' ? 'md-badge md-badge-yellow' :
                'md-badge md-badge-red';

    if (loading) {
        return (
            <div className="md-loading">
                <div className="md-spinner"></div>
                <p>Loading Medical Dashboard…</p>
            </div>
        );
    }

    /* ── Form JSX as a variable (NOT a nested component — avoids remount focus bug) ── */
    const activeSubmit = showAddModal ? handleAddInjury : handleUpdateInjury;
    const activeLabel = showAddModal ? 'Add Injury' : 'Update Injury';
    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedInjury(null);
        resetForm();
    };

    const injuryFormJSX = (
        <form onSubmit={activeSubmit}>

            {/* 1. SELECT — Player */}
            <div className="md-form-group">
                <label className="md-label">Player</label>
                <select name="playerId" value={formData.playerId}
                    onChange={handleInputChange} className="md-select" required>
                    <option value="">Select Player</option>
                    {players.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                </select>
            </div>

            {/* 2. DATE — Injury Date */}
            <div className="md-form-group">
                <label className="md-label">Date of Injury</label>
                <input
                    type="date"
                    name="dateOfInjury"
                    value={formData.dateOfInjury}
                    onChange={handleInputChange}
                    className="md-input"
                    required
                />
            </div>

            <div className="md-form-row">
                {/* 3. SELECT — Injury Type */}
                <div className="md-form-group">
                    <label className="md-label">Injury Type</label>
                    <select name="injuryType" value={formData.injuryType}
                        onChange={handleInputChange} className="md-select" required>
                        <option value="">Select Type</option>
                        {['Muscle Strain', 'Ligament Sprain', 'Fracture', 'Concussion',
                            'Tendinitis', 'Dislocation', 'Contusion', 'Other'].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                    </select>
                </div>
                {/* 4. SELECT — Body Part */}
                <div className="md-form-group">
                    <label className="md-label">Body Part</label>
                    <select name="bodyPart" value={formData.bodyPart}
                        onChange={handleInputChange} className="md-select" required>
                        <option value="">Select Part</option>
                        {['Head', 'Neck', 'Shoulder', 'Arm', 'Elbow', 'Wrist', 'Hand',
                            'Back', 'Hip', 'Thigh', 'Knee', 'Ankle', 'Foot', 'Other'].map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                    </select>
                </div>
            </div>

            <div className="md-form-row">
                {/* 5. SELECT — Severity */}
                <div className="md-form-group">
                    <label className="md-label">Severity</label>
                    <select name="severity" value={formData.severity}
                        onChange={handleInputChange} className="md-select">
                        {['Minor', 'Moderate', 'Severe', 'Critical'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                {/* 6. SELECT — Status */}
                <div className="md-form-group">
                    <label className="md-label">Status</label>
                    <select name="status" value={formData.status}
                        onChange={handleInputChange} className="md-select">
                        {['Active', 'Recovering', 'Healed'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 7. TEXT — Doctor / Treated By */}
            <div className="md-form-group">
                <label className="md-label">Treated By (Doctor / Physio)</label>
                <input
                    type="text"
                    name="treatedBy"
                    value={formData.treatedBy}
                    onChange={handleInputChange}
                    className="md-input"
                    placeholder="e.g. Dr. Sharma"
                />
            </div>

            {/* 8. RANGE — Pain Level */}
            <div className="md-form-group">
                <label className="md-label">
                    Pain Level:&nbsp;
                    <strong style={{ color: 'hsl(160, 84%, 39%)' }}>{formData.painLevel}</strong>
                    &nbsp;/ 10
                </label>
                <input
                    type="range"
                    name="painLevel"
                    min="1" max="10"
                    value={formData.painLevel}
                    onChange={handleInputChange}
                    className="md-range"
                />
            </div>

            {/* 9. TEXTAREA — Description */}
            <div className="md-form-group">
                <label className="md-label">Description *</label>
                <textarea name="description" value={formData.description}
                    onChange={handleInputChange} className="md-textarea"
                    placeholder="Describe the injury in detail…" rows="2" required />
            </div>

            {/* 10. TEXTAREA — Treatment */}
            <div className="md-form-group">
                <label className="md-label">Treatment Plan</label>
                <textarea name="treatment" value={formData.treatment}
                    onChange={handleInputChange} className="md-textarea"
                    placeholder="Describe the treatment plan…" rows="3" />
            </div>

            <div className="md-form-row">
                {/* 11. NUMBER — Expected Recovery Days */}
                <div className="md-form-group">
                    <label className="md-label">Expected Recovery Days</label>
                    <input type="number" name="expectedRecoveryDays"
                        value={formData.expectedRecoveryDays}
                        onChange={handleInputChange}
                        className="md-input" placeholder="e.g. 14" />
                </div>

                {/* 12. CHECKBOX — Cleared for Training */}
                <div className="md-form-group">
                    <label className="md-label">Cleared for Training</label>
                    <label className="md-checkbox-label">
                        <input
                            type="checkbox"
                            name="clearedForTraining"
                            checked={formData.clearedForTraining}
                            onChange={(e) => setFormData(prev => ({ ...prev, clearedForTraining: e.target.checked }))}
                            className="md-checkbox"
                        />
                        <span>Player is cleared to return to training</span>
                    </label>
                </div>
            </div>

            {/* 13. TEXTAREA — Notes */}
            <div className="md-form-group">
                <label className="md-label">Notes</label>
                <textarea name="notes" value={formData.notes}
                    onChange={handleInputChange} className="md-textarea"
                    placeholder="Additional notes…" rows="2" />
            </div>

            <div className="md-modal-actions">
                <button type="button" className="md-btn-cancel" onClick={closeModal}>
                    Cancel
                </button>
                <button type="submit" className="md-btn-submit">{activeLabel}</button>
            </div>
        </form>
    );

    return (
        <div className="md-page">
            {/* ── Navbar ── */}
            <nav className="md-nav">
                <div className="md-nav-brand">
                    <Activity size={22} className="md-brand-icon" />
                    <span className="md-brand-text">
                        Medi<span className="md-brand-highlight">Predict</span>
                    </span>
                    <span className="md-nav-badge">Medical Staff</span>
                </div>
                <div className="md-nav-right">
                    <span className="md-nav-welcome">Welcome, <strong>{user?.name}</strong></span>
                    <button className="md-logout-btn" onClick={handleLogout}>
                        <LogOut size={15} /> Logout
                    </button>
                </div>
            </nav>

            <main className="md-main">
                {error && <div className="md-error">{error}</div>}

                {/* ── Page Header ── */}
                <div className="md-header">
                    <img src={doctorSilhouette} alt="Medical Staff" className="md-header-img" />
                    <div className="md-header-text">
                        <p className="md-section-label">MEDICAL DASHBOARD</p>
                        <h1 className="md-page-title">Injury Management</h1>
                        <p className="md-page-subtitle">
                            Manage player injuries, track recovery progress, and maintain
                            comprehensive medical records for the team.
                        </p>
                        <div className="md-header-actions">
                            <button className="md-btn-primary" onClick={() => setShowAddModal(true)}>
                                <PlusCircle size={16} /> Add Injury Record
                            </button>
                            <button className="md-btn-outline" onClick={() => navigate('/predictions')}>
                                <Bot size={16} /> AI Prediction Module
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Stats Grid ── */}
                <div className="md-stats-grid">
                    <div className="md-stat-card">
                        <div className="md-stat-icon"><Stethoscope size={20} /></div>
                        <div>
                            <div className="md-stat-val">{stats?.totalInjuries ?? '—'}</div>
                            <div className="md-stat-lbl">Total Injuries</div>
                        </div>
                    </div>
                    <div className="md-stat-card">
                        <div className="md-stat-icon"><ShieldAlert size={20} /></div>
                        <div>
                            <div className="md-stat-val">{stats?.activeInjuries ?? '—'}</div>
                            <div className="md-stat-lbl">Active</div>
                        </div>
                    </div>
                    <div className="md-stat-card">
                        <div className="md-stat-icon"><HeartPulse size={20} /></div>
                        <div>
                            <div className="md-stat-val">{stats?.recoveringInjuries ?? '—'}</div>
                            <div className="md-stat-lbl">Recovering</div>
                        </div>
                    </div>
                    <div className="md-stat-card">
                        <div className="md-stat-icon"><CheckCircle size={20} /></div>
                        <div>
                            <div className="md-stat-val">{stats?.healedInjuries ?? '—'}</div>
                            <div className="md-stat-lbl">Healed</div>
                        </div>
                    </div>
                </div>

                {/* ── Injury Records Table ── */}
                <div className="md-table-header">
                    <h3 className="md-section-title">Injury Records</h3>
                    <div className="md-search-bar">
                        {/* Text search — player name */}
                        <div className="md-search-input-wrap">
                            <Search size={15} className="md-search-icon" />
                            <input
                                type="text"
                                className="md-search-input"
                                placeholder="Search player name…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="md-search-clear" onClick={() => setSearchQuery('')}>
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        {/* Dropdown — injury type */}
                        <select
                            className="md-search-select"
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            {['Muscle Strain', 'Ligament Sprain', 'Fracture', 'Concussion',
                                'Tendinitis', 'Dislocation', 'Contusion', 'Other'].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                        </select>

                        {/* Dropdown — status */}
                        <select
                            className="md-search-select"
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {['Active', 'Recovering', 'Healed'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        {/* Result count + clear all */}
                        <span className="md-search-count">
                            {filteredInjuries.length} of {injuries.length}
                        </span>
                        {(searchQuery || filterType || filterStatus) && (
                            <button className="md-btn-clear-filters" onClick={() => {
                                setSearchQuery(''); setFilterType(''); setFilterStatus('');
                            }}>
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div className="md-card">
                    <table className="md-table">
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Injury</th>
                                <th>Date</th>
                                <th>Body Part</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th>Cleared</th>
                                <th>Recovery Days</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInjuries.length === 0 ? (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--muted-fg)' }}>
                                        {injuries.length === 0 ? 'No injury records found.' : 'No records match your search.'}
                                    </td>
                                </tr>
                            ) : filteredInjuries.map(injury => (
                                <tr key={injury._id}>
                                    <td>{injury.playerId?.name}</td>
                                    <td>{injury.injuryType}</td>
                                    <td>{injury.dateOfInjury ? new Date(injury.dateOfInjury).toLocaleDateString() : '—'}</td>
                                    <td>{injury.bodyPart}</td>
                                    <td><span className={severityClass(injury.severity)}>{injury.severity}</span></td>
                                    <td><span className={statusClass(injury.status)}>{injury.status}</span></td>
                                    <td>
                                        <span className={injury.clearedForTraining ? 'md-badge md-badge-green' : 'md-badge md-badge-red'}>
                                            {injury.clearedForTraining ? '✓ Yes' : '✗ No'}
                                        </span>
                                    </td>
                                    <td>{injury.predictedRecoveryDays ?? '—'}</td>
                                    <td>
                                        <div className="md-btn-row">
                                            <button className="md-btn-edit" onClick={() => openEditModal(injury)}>Edit</button>
                                            <button className="md-btn-del" onClick={() => handleDeleteInjury(injury._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* ── Add Injury Modal ── */}
            {showAddModal && (
                <div className="md-modal-overlay">
                    <div className="md-modal">
                        <h2 className="md-modal-title">Add New Injury Record</h2>
                        {injuryFormJSX}
                    </div>
                </div>
            )}

            {/* ── Edit Injury Modal ── */}
            {showEditModal && (
                <div className="md-modal-overlay">
                    <div className="md-modal">
                        <h2 className="md-modal-title">Edit Injury Record</h2>
                        {injuryFormJSX}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalDashboard;
