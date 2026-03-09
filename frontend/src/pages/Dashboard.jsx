import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Activity, LogOut, User, Shield, Stethoscope, TrendingUp, ChevronRight,
    PlusCircle, Calendar, AlertTriangle, CheckCircle, HeartPulse, X,
    Mail, Ruler, Scale, Brain, Clock, Target, Lightbulb
} from 'lucide-react';
import playerSilhouette from '../assets/silhouettes/player-silhouette.png';
import './Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [playerProfile, setPlayerProfile] = useState(null);
    const [injuries, setInjuries] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPredictionModal, setShowPredictionModal] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const [submittingInjury, setSubmittingInjury] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        injuryType: '',
        bodyPart: '',
        severity: 'Minor',
        description: '',
        painLevel: 5,
        dateOfInjury: new Date().toISOString().split('T')[0]
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            
            // Fetch player data if user is a player
            const isPlayer = userData.roles?.some(r => r.name === 'Player') || userData.role === 'Player';
            if (isPlayer) {
                fetchPlayerData(userData.token);
            } else {
                setLoading(false);
            }
        }
    }, [navigate]);

    const fetchPlayerData = async (token) => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Fetch profile and injuries in parallel
            const [profileRes, injuriesRes] = await Promise.allSettled([
                axios.get('http://localhost:5000/api/player-profile/me', config),
                axios.get('http://localhost:5000/api/player-profile/injuries', config)
            ]);

            if (profileRes.status === 'fulfilled') {
                setPlayerProfile(profileRes.value.data);
            }
            if (injuriesRes.status === 'fulfilled') {
                setInjuries(injuriesRes.value.data);
            }
        } catch (err) {
            console.error('Error fetching player data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const parsed = type === 'range' || type === 'number' ? Number(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsed }));
    };

    const handleAddInjury = async (e) => {
        e.preventDefault();
        try {
            setSubmittingInjury(true);
            const token = user?.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post('http://localhost:5000/api/player-profile/injuries', formData, config);
            
            // Store the prediction result
            const { injury, prediction, aiPowered } = response.data;
            setPredictionResult({
                injury: injury || response.data,
                prediction: prediction,
                aiPowered: aiPowered
            });
            
            setShowAddModal(false);
            resetForm();
            setError('');
            fetchPlayerData(token);
            
            // Show prediction modal
            setShowPredictionModal(true);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to submit injury';
            setError(errorMsg);
            console.error('Add injury error:', err.response?.data || err);
        } finally {
            setSubmittingInjury(false);
        }
    };

    const resetForm = () => {
        setFormData({
            injuryType: '',
            bodyPart: '',
            severity: 'Minor',
            description: '',
            painLevel: 5,
            dateOfInjury: new Date().toISOString().split('T')[0]
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return (
        <div className="db-loading">
            <div className="db-spinner"></div>
            <p>Loading...</p>
        </div>
    );

    // Safely extract role names
    const getRoleNames = () => {
        if (!user.roles) return [];
        if (Array.isArray(user.roles) && typeof user.roles[0] === 'object') {
            return user.roles.map(r => r.name);
        }
        if (Array.isArray(user.roles)) return user.roles;
        return user.role ? [user.role] : [];
    };

    const roleNames = getRoleNames();
    const roleDisplay = roleNames.join(', ') || 'Unknown';

    const isAdmin = roleNames.includes('Admin');
    const isCoach = roleNames.includes('Coach');
    const isMedical = roleNames.includes('Medical');
    const isPlayer = roleNames.includes('Player');

    // Role badge config
    const roleBadgeClass = isAdmin ? 'badge-admin'
        : isCoach ? 'badge-coach'
            : isMedical ? 'badge-medical'
                : 'badge-player';

    // Badge helper functions
    const severityClass = (s) =>
        s === 'Minor' ? 'db-badge db-badge-green' :
            s === 'Moderate' ? 'db-badge db-badge-yellow' :
                'db-badge db-badge-red';

    const statusClass = (s) =>
        s === 'Healed' || s === 'Recovered' ? 'db-badge db-badge-green' :
            s === 'Recovering' ? 'db-badge db-badge-yellow' :
                'db-badge db-badge-red';

    // Calculate injury stats for player
    const activeInjuries = injuries.filter(i => i.status === 'Active').length;
    const recoveringInjuries = injuries.filter(i => i.status === 'Recovering').length;
    const healedInjuries = injuries.filter(i => i.status === 'Healed' || i.status === 'Recovered').length;

    return (
        <div className="db-page">
            {/* Navbar */}
            <nav className="db-nav">
                <div className="db-nav-brand">
                    <Activity size={22} className="db-brand-icon" />
                    <span className="db-brand-text">
                        Medi<span className="db-brand-highlight">Predict</span>
                    </span>
                </div>
                <div className="db-nav-right">
                    <span className="db-nav-welcome">Welcome, <strong>{user.name}</strong></span>
                    <button className="db-logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </nav>

            <main className="db-main">
                {error && <div className="db-error">{error}</div>}

                {/* Page Header */}
                <div className="db-header-section">
                    {isPlayer && (
                        <img src={playerSilhouette} alt="Player" className="db-header-img" />
                    )}
                    <div className="db-header-text">
                        <p className="db-section-label">OVERVIEW</p>
                        <h1 className="db-page-title">Player Dashboard</h1>
                        {isPlayer && (
                            <p className="db-page-subtitle">
                                Track your injuries, monitor recovery progress, and stay on top of your health.
                            </p>
                        )}
                    </div>
                    <span className={`db-role-badge ${roleBadgeClass}`}>{roleDisplay}</span>
                </div>

                {/* Player Profile Section - Only for Players */}
                {isPlayer && (
                    <div className="db-section">
                        <div className="db-section-header">
                            <p className="db-section-label">MY PROFILE</p>
                            {!playerProfile && (
                                <button className="db-btn-primary" onClick={() => navigate('/complete-profile')}>
                                    <PlusCircle size={16} /> Complete Profile
                                </button>
                            )}
                        </div>
                        <div className="db-profile-grid">
                            {/* Always show basic user info */}
                            <div className="db-stat-card">
                                <div className="db-stat-icon-wrap">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="db-stat-label">Name</p>
                                    <p className="db-stat-value">{user.name}</p>
                                </div>
                            </div>
                            <div className="db-stat-card db-stat-card-wide">
                                <div className="db-stat-icon-wrap">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="db-stat-label">Email</p>
                                    <p className="db-stat-value">{user.email}</p>
                                </div>
                            </div>
                            {/* Show profile data if exists */}
                            {playerProfile && (
                                <>
                                    <div className="db-stat-card">
                                        <div className="db-stat-icon-wrap">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <p className="db-stat-label">Playing Role</p>
                                            <p className="db-stat-value">{playerProfile.playingRole}</p>
                                        </div>
                                    </div>
                                    <div className="db-stat-card">
                                        <div className="db-stat-icon-wrap">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="db-stat-label">Age</p>
                                            <p className="db-stat-value">{playerProfile.age} years</p>
                                        </div>
                                    </div>
                                    <div className="db-stat-card">
                                        <div className="db-stat-icon-wrap">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <p className="db-stat-label">Experience</p>
                                            <p className="db-stat-value">{playerProfile.experienceYears} years</p>
                                        </div>
                                    </div>
                                    {playerProfile.height && (
                                        <div className="db-stat-card">
                                            <div className="db-stat-icon-wrap">
                                                <Ruler size={20} />
                                            </div>
                                            <div>
                                                <p className="db-stat-label">Height</p>
                                                <p className="db-stat-value">{playerProfile.height} cm</p>
                                            </div>
                                        </div>
                                    )}
                                    {playerProfile.weight && (
                                        <div className="db-stat-card">
                                            <div className="db-stat-icon-wrap">
                                                <Scale size={20} />
                                            </div>
                                            <div>
                                                <p className="db-stat-label">Weight</p>
                                                <p className="db-stat-value">{playerProfile.weight} kg</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        {!playerProfile && (
                            <div className="db-profile-incomplete">
                                <AlertTriangle size={16} />
                                <span>Complete your profile to get personalized injury predictions and recovery timelines.</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Injury Stats - Only for Players */}
                {isPlayer && (
                    <div className="db-section">
                        <div className="db-section-header">
                            <p className="db-section-label">MY INJURY RECORDS</p>
                            <button className="db-btn-primary" onClick={() => setShowAddModal(true)}>
                                <PlusCircle size={16} /> Report Injury
                            </button>
                        </div>
                        <div className="db-stats-grid">
                            <div className="db-stat-card">
                                <div className="db-stat-icon-wrap db-icon-red">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <p className="db-stat-label">Active Injuries</p>
                                    <p className="db-stat-value">{activeInjuries}</p>
                                </div>
                            </div>
                            <div className="db-stat-card">
                                <div className="db-stat-icon-wrap db-icon-yellow">
                                    <HeartPulse size={20} />
                                </div>
                                <div>
                                    <p className="db-stat-label">Recovering</p>
                                    <p className="db-stat-value">{recoveringInjuries}</p>
                                </div>
                            </div>
                            <div className="db-stat-card">
                                <div className="db-stat-icon-wrap db-icon-green">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <p className="db-stat-label">Healed</p>
                                    <p className="db-stat-value">{healedInjuries}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Injury Table - Only for Players */}
                {isPlayer && (
                    <div className="db-card">
                        <table className="db-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Injury Type</th>
                                    <th>Body Part</th>
                                    <th>Severity</th>
                                    <th>Status</th>
                                    <th>Pain Level</th>
                                    <th>Est. Recovery</th>
                                </tr>
                            </thead>
                            <tbody>
                                {injuries.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="db-table-empty">
                                            No injury records found. Click "Report Injury" to add one.
                                        </td>
                                    </tr>
                                ) : injuries.map(injury => (
                                    <tr key={injury._id}>
                                        <td>{injury.dateOfInjury ? new Date(injury.dateOfInjury).toLocaleDateString() : '—'}</td>
                                        <td>{injury.injuryType}</td>
                                        <td>{injury.bodyPart}</td>
                                        <td><span className={severityClass(injury.severity)}>{injury.severity}</span></td>
                                        <td><span className={statusClass(injury.status)}>{injury.status}</span></td>
                                        <td>{injury.painLevel ? `${injury.painLevel}/10` : '—'}</td>
                                        <td>{injury.predictedRecoveryDays ? `${injury.predictedRecoveryDays} days` : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Non-player Stats */}
                {!isPlayer && (
                    <div className="db-stats-grid">
                        <div className="db-stat-card">
                            <div className="db-stat-icon-wrap">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="db-stat-label">Account Email</p>
                                <p className="db-stat-value">{user.email}</p>
                            </div>
                        </div>
                        <div className="db-stat-card">
                            <div className="db-stat-icon-wrap">
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="db-stat-label">Assigned Role</p>
                                <p className="db-stat-value">{roleDisplay}</p>
                            </div>
                        </div>
                        <div className="db-stat-card">
                            <div className="db-stat-icon-wrap">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="db-stat-label">User ID</p>
                                <p className="db-stat-value db-truncate">{user._id || user.id}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Role-based message */}
                <div className="db-info-banner">
                    {isAdmin && <p className="db-info-msg db-info-admin"><Shield size={16} /> You have full Admin privileges. Manage users and roles via the API.</p>}
                    {isPlayer && !playerProfile && <p className="db-info-msg db-info-player"><Activity size={16} /> Complete your profile to access all features. Report any injuries to track your recovery.</p>}
                    {isCoach && <p className="db-info-msg db-info-coach"><TrendingUp size={16} /> Monitor your team's health and performance data.</p>}
                    {isMedical && <p className="db-info-msg db-info-medical"><Stethoscope size={16} /> Access and manage player injury records.</p>}
                </div>

                {/* Quick Access Cards */}
                {(isCoach || isAdmin || isMedical) && (
                    <div className="db-section">
                        <p className="db-section-label">QUICK ACCESS</p>
                        <div className="db-quick-grid">
                            {(isCoach || isAdmin) && (
                                <button className="db-quick-card" onClick={() => navigate('/coach-dashboard')}>
                                    <div className="db-quick-icon">
                                        <TrendingUp size={22} />
                                    </div>
                                    <div className="db-quick-text">
                                        <span className="db-quick-title">Coach Dashboard</span>
                                        <span className="db-quick-desc">Team health, training loads & injury view</span>
                                    </div>
                                    <ChevronRight size={18} className="db-quick-arrow" />
                                </button>
                            )}
                            {(isMedical || isAdmin) && (
                                <button className="db-quick-card" onClick={() => navigate('/medical-dashboard')}>
                                    <div className="db-quick-icon">
                                        <Stethoscope size={22} />
                                    </div>
                                    <div className="db-quick-text">
                                        <span className="db-quick-title">Medical Dashboard</span>
                                        <span className="db-quick-desc">Manage injury records & recovery plans</span>
                                    </div>
                                    <ChevronRight size={18} className="db-quick-arrow" />
                                </button>
                            )}
                            {(isMedical || isAdmin) && (
                                <button className="db-quick-card" onClick={() => navigate('/predictions')}>
                                    <div className="db-quick-icon">
                                        <Activity size={22} />
                                    </div>
                                    <div className="db-quick-text">
                                        <span className="db-quick-title">AI Prediction Module</span>
                                        <span className="db-quick-desc">Generate & review recovery predictions</span>
                                    </div>
                                    <ChevronRight size={18} className="db-quick-arrow" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Add Injury Modal */}
            {showAddModal && (
                <div className="db-modal-overlay">
                    <div className="db-modal">
                        <div className="db-modal-header">
                            <h2 className="db-modal-title">Report New Injury</h2>
                            <button className="db-modal-close" onClick={() => { setShowAddModal(false); resetForm(); }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddInjury}>
                            <div className="db-form-group">
                                <label className="db-label">Date of Injury</label>
                                <input
                                    type="date"
                                    name="dateOfInjury"
                                    value={formData.dateOfInjury}
                                    onChange={handleInputChange}
                                    className="db-input"
                                    required
                                />
                            </div>

                            <div className="db-form-row">
                                <div className="db-form-group">
                                    <label className="db-label">Injury Type</label>
                                    <select name="injuryType" value={formData.injuryType}
                                        onChange={handleInputChange} className="db-select" required>
                                        <option value="">Select Type</option>
                                        {['Muscle Strain', 'Ligament Sprain', 'Fracture', 'Concussion',
                                            'Tendinitis', 'Dislocation', 'Contusion', 'Other'].map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className="db-form-group">
                                    <label className="db-label">Body Part</label>
                                    <select name="bodyPart" value={formData.bodyPart}
                                        onChange={handleInputChange} className="db-select" required>
                                        <option value="">Select Part</option>
                                        {['Head', 'Neck', 'Shoulder', 'Arm', 'Elbow', 'Wrist', 'Hand',
                                            'Back', 'Hip', 'Thigh', 'Knee', 'Ankle', 'Foot', 'Other'].map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className="db-form-group">
                                <label className="db-label">Severity</label>
                                <select name="severity" value={formData.severity}
                                    onChange={handleInputChange} className="db-select">
                                    {['Minor', 'Moderate', 'Severe', 'Critical'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="db-form-group">
                                <label className="db-label">
                                    Pain Level: <strong style={{ color: 'var(--primary)' }}>{formData.painLevel}</strong> / 10
                                </label>
                                <input
                                    type="range"
                                    name="painLevel"
                                    min="1" max="10"
                                    value={formData.painLevel}
                                    onChange={handleInputChange}
                                    className="db-range"
                                />
                            </div>

                            <div className="db-form-group">
                                <label className="db-label">Description *</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description}
                                    onChange={handleInputChange} 
                                    className="db-textarea"
                                    placeholder="Describe how the injury occurred and symptoms…" 
                                    rows="3" 
                                    required 
                                />
                            </div>

                            <div className="db-modal-actions">
                                <button type="button" className="db-btn-cancel" onClick={() => { setShowAddModal(false); resetForm(); }}>
                                    Cancel
                                </button>
                                <button type="submit" className="db-btn-submit" disabled={submittingInjury}>
                                    {submittingInjury ? (
                                        <>
                                            <span className="db-btn-spinner"></span>
                                            Analyzing with AI...
                                        </>
                                    ) : 'Submit Injury Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* AI Prediction Result Modal */}
            {showPredictionModal && predictionResult && (
                <div className="db-modal-overlay">
                    <div className="db-modal db-prediction-modal">
                        <div className="db-modal-header db-prediction-header">
                            <div className="db-prediction-title-wrap">
                                <Brain size={24} className="db-prediction-icon" />
                                <h2 className="db-modal-title">AI Recovery Prediction</h2>
                            </div>
                            <button className="db-modal-close" onClick={() => setShowPredictionModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="db-prediction-content">
                            {predictionResult.aiPowered && (
                                <div className="db-ai-badge">
                                    <Brain size={14} />
                                    <span>Powered by Gemini AI</span>
                                </div>
                            )}
                            
                            <div className="db-prediction-main">
                                <div className="db-prediction-days">
                                    <Clock size={32} />
                                    <div className="db-prediction-days-text">
                                        <span className="db-prediction-days-number">
                                            {predictionResult.prediction?.predictedDays || '—'}
                                        </span>
                                        <span className="db-prediction-days-label">Estimated Days to Recovery</span>
                                    </div>
                                </div>
                                
                                {predictionResult.prediction?.confidenceScore && (
                                    <div className="db-prediction-confidence">
                                        <Target size={18} />
                                        <div className="db-confidence-bar-wrap">
                                            <div className="db-confidence-bar">
                                                <div 
                                                    className="db-confidence-fill" 
                                                    style={{ width: `${predictionResult.prediction.confidenceScore}%` }}
                                                ></div>
                                            </div>
                                            <span className="db-confidence-value">
                                                {predictionResult.prediction.confidenceScore}% Confidence
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {predictionResult.prediction?.recoveryRangeMin && predictionResult.prediction?.recoveryRangeMax && (
                                <div className="db-prediction-range">
                                    <span className="db-range-label">Recovery Range:</span>
                                    <span className="db-range-value">
                                        {predictionResult.prediction.recoveryRangeMin} - {predictionResult.prediction.recoveryRangeMax} days
                                    </span>
                                </div>
                            )}
                            
                            {predictionResult.prediction?.recommendations && (
                                <div className="db-prediction-section">
                                    <div className="db-prediction-section-header">
                                        <Lightbulb size={18} />
                                        <span>Recommendations</span>
                                    </div>
                                    <p className="db-prediction-text">{predictionResult.prediction.recommendations}</p>
                                </div>
                            )}
                            
                            {predictionResult.prediction?.riskFactors && (
                                <div className="db-prediction-section db-prediction-risk">
                                    <div className="db-prediction-section-header">
                                        <AlertTriangle size={18} />
                                        <span>Risk Factors</span>
                                    </div>
                                    <p className="db-prediction-text">{predictionResult.prediction.riskFactors}</p>
                                </div>
                            )}
                            
                            <div className="db-prediction-injury-summary">
                                <h4>Injury Recorded</h4>
                                <div className="db-prediction-injury-details">
                                    <span><strong>Type:</strong> {predictionResult.injury?.injuryType}</span>
                                    <span><strong>Body Part:</strong> {predictionResult.injury?.bodyPart}</span>
                                    <span><strong>Severity:</strong> {predictionResult.injury?.severity}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="db-modal-actions">
                            <button className="db-btn-submit" onClick={() => setShowPredictionModal(false)}>
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
