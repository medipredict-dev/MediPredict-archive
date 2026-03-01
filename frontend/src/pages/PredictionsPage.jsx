import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Clock, TrendingUp, ActivitySquare, AlertCircle, Save, X, Edit, Trash2, Search } from 'lucide-react';

const PredictionsPage = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        player: '60d5ecb8b392d700153efabc', // Default dummy ObjectIds for testing
        injury: '60d5ecb8b392d700153efabd',
        predictedDays: 0,
        confidenceScore: 80,
        recoveryRangeMin: 0,
        recoveryRangeMax: 0,
        predictionDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
    });

    const [editId, setEditId] = useState(null);

    // For demonstration, some dummy IDs for the dropdowns
    const MOCK_PLAYERS = [
        { id: '60d5ecb8b392d700153efabc', name: 'John Doe (P-001)' },
        { id: '60d5ecb8b392d700153efabe', name: 'Jane Smith (P-002)' },
        { id: '60d5ecb8b392d700153efabf', name: 'Mike Johnson (P-003)' },
        { id: '60d5ecb8b392d700153efab1', name: 'Sarah Williams (P-004)' }
    ];

    const MOCK_INJURIES = [
        { id: '60d5ecb8b392d700153efabd', name: 'ACL Tear' },
        { id: '60d5ecb8b392d700153efab6', name: 'Hamstring Strain' },
        { id: '60d5ecb8b392d700153efab7', name: 'Ankle Sprain' }
    ];

    // Fetch all predictions
    const fetchPredictions = async () => {
        try {
            setLoading(true);
            const url = searchTerm
                ? `/api/predictions?player=${searchTerm}`
                : `/api/predictions`;
            const res = await axios.get(`http://localhost:5000${url}`);
            setPredictions(res.data);
        } catch (err) {
            console.error('Error fetching predictions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPredictions();
    }, [searchTerm]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSliderChange = (e) => {
        setFormData(prev => ({ ...prev, confidenceScore: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                if (!window.confirm('Are you sure you want to update this prediction record?')) return;
                await axios.put(`http://localhost:5000/api/predictions/${editId}`, formData);
            } else {
                if (!window.confirm('Are you sure you want to save this new prediction?')) return;
                await axios.post(`http://localhost:5000/api/predictions`, formData);
            }
            setFormData({
                player: MOCK_PLAYERS[0].id,
                injury: MOCK_INJURIES[0].id,
                predictedDays: 0,
                confidenceScore: 80,
                recoveryRangeMin: 0,
                recoveryRangeMax: 0,
                predictionDate: new Date().toISOString().split('T')[0],
                status: 'Pending'
            });
            setEditId(null);
            fetchPredictions();
        } catch (err) {
            console.error('Error saving prediction', err);
            alert(err.response?.data?.message || err.message || 'Failed to save prediction record.');
        }
    };

    const handleEdit = (pred) => {
        setEditId(pred._id);
        setFormData({
            player: pred.player?._id || pred.player || MOCK_PLAYERS[0].id,
            injury: pred.injury?._id || pred.injury || MOCK_INJURIES[0].id,
            predictedDays: pred.predictedDays,
            confidenceScore: pred.confidenceScore,
            recoveryRangeMin: pred.recoveryRangeMin,
            recoveryRangeMax: pred.recoveryRangeMax,
            predictionDate: new Date(pred.predictionDate).toISOString().split('T')[0],
            status: pred.status
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this prediction?')) {
            try {
                await axios.delete(`http://localhost:5000/api/predictions/${id}`);
                fetchPredictions();
            } catch (err) {
                console.error('Error deleting prediction:', err);
            }
        }
    };

    const cancelEdit = () => {
        setEditId(null);
        setFormData({
            player: MOCK_PLAYERS[0].id,
            injury: MOCK_INJURIES[0].id,
            predictedDays: 0,
            confidenceScore: 80,
            recoveryRangeMin: 0,
            recoveryRangeMax: 0,
            predictionDate: new Date().toISOString().split('T')[0],
            status: 'Pending'
        });
    };

    // Dark Theme Colors mimicking the landing page
    const theme = {
        bgMain: 'hsl(220, 20%, 7%)',     // Deep dark background
        bgCard: 'hsl(220, 18%, 10%)',     // Slightly lighter panel background
        primary: 'hsl(160, 84%, 39%)',    // Bright green/teal from the buttons
        primaryHover: 'hsl(160, 84%, 35%)',
        textMain: 'hsl(210, 20%, 92%)',   // White-ish
        textMuted: 'hsl(215, 15%, 55%)',  // Light grey
        border: 'hsl(220, 14%, 18%)',     // Dark border
        inputBg: 'hsl(220, 14%, 18%)',    // Darker input background
        accentWarning: '#f59e0b',
        accentDanger: '#ef4444'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '6px',
        backgroundColor: theme.inputBg,
        border: `1px solid ${theme.border}`,
        color: theme.textMain,
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        marginBottom: '0.4rem',
        color: theme.textMuted
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.bgMain, color: theme.textMain, padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center' }}>
                    <ActivitySquare style={{ marginRight: '1rem', color: theme.primary }} size={32} />
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0, letterSpacing: '-0.5px' }}>
                        <span style={{ color: theme.textMain }}>AI </span>
                        <span style={{ color: theme.primary }}>Prediction Module</span>
                    </h1>
                </header>

                {/* Main Container - Split Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem' }}>

                    {/* Left Side: Form */}
                    <div style={{
                        background: theme.bgCard,
                        padding: '2rem',
                        borderRadius: '12px',
                        border: `1px solid ${theme.border}`,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: theme.primary, fontWeight: '600' }}>
                            {editId ? 'Update Prediction' : 'Generate New Prediction'}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Control 1: Player ID (Dropdown) */}
                            <div>
                                <label style={labelStyle}>Select Player</label>
                                <select name="player" value={formData.player} onChange={handleInputChange} required style={inputStyle}>
                                    {MOCK_PLAYERS.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Control 2: Injury ID (Dropdown) */}
                            <div>
                                <label style={labelStyle}>Injury Category</label>
                                <select name="injury" value={formData.injury} onChange={handleInputChange} required style={inputStyle}>
                                    {MOCK_INJURIES.map(i => (
                                        <option key={i.id} value={i.id}>{i.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {/* Control 3: Predicted Recovery Days (Number) */}
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Predicted Days</label>
                                    <input type="number" name="predictedDays" value={formData.predictedDays} onChange={handleInputChange} min="0" required style={inputStyle} />
                                </div>

                                {/* Control 4: Confidence Score (Slider) */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <label style={labelStyle}>
                                        Confidence: <span style={{ color: theme.primary, fontWeight: 'bold' }}>{formData.confidenceScore}%</span>
                                    </label>
                                    <input type="range" name="confidenceScore" value={formData.confidenceScore} onChange={handleSliderChange} min="0" max="100" style={{ accentColor: theme.primary, marginTop: '0.4rem' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {/* Control 5 & 6: Recovery Range Min & Max (Number) */}
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Est. Min Days</label>
                                    <input type="number" name="recoveryRangeMin" value={formData.recoveryRangeMin} onChange={handleInputChange} min="0" required style={inputStyle} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Est. Max Days</label>
                                    <input type="number" name="recoveryRangeMax" value={formData.recoveryRangeMax} onChange={handleInputChange} min="0" required style={inputStyle} />
                                </div>
                            </div>

                            {/* Control 7: Prediction Date (Date Picker) */}
                            <div>
                                <label style={labelStyle}>Date of Prediction</label>
                                <input type="date" name="predictionDate" value={formData.predictionDate} onChange={handleInputChange} required style={inputStyle} />
                            </div>

                            {/* Control 8: Status (Dropdown) */}
                            <div>
                                <label style={labelStyle}>Verification Outcome</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} style={inputStyle}>
                                    <option value="Pending">Pending Validation</option>
                                    <option value="Accurate">Accurate</option>
                                    <option value="Inaccurate">Inaccurate</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1, padding: '0.875rem',
                                        background: theme.primary, color: '#000',
                                        borderRadius: '8px', border: 'none',
                                        fontWeight: 'bold', fontSize: '1rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        boxShadow: `0 4px 15px rgba(12, 232, 141, 0.2)`
                                    }}
                                    onMouseOver={(e) => e.target.style.background = theme.primaryHover}
                                    onMouseOut={(e) => e.target.style.background = theme.primary}
                                >
                                    <Save size={18} style={{ marginRight: '0.5rem' }} />
                                    {editId ? 'Update Record' : 'Save Prediction'}
                                </button>

                                {editId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        style={{
                                            flex: 1, padding: '0.875rem',
                                            background: 'transparent', color: theme.textMain,
                                            borderRadius: '8px', border: `1px solid ${theme.border}`,
                                            fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <X size={18} style={{ marginRight: '0.5rem' }} /> Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Right Side: List / Display History */}
                    <div style={{
                        background: theme.bgCard,
                        padding: '2rem',
                        borderRadius: '12px',
                        border: `1px solid ${theme.border}`,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${theme.border}` }}>
                            <h2 style={{ fontSize: '1.25rem', color: theme.textMain, fontWeight: '600', margin: 0 }}>Analytics History</h2>

                            {/* Search Component */}
                            <div style={{ display: 'flex', alignItems: 'center', background: theme.inputBg, border: `1px solid ${theme.border}`, padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                                <Search size={16} color={theme.textMuted} style={{ marginRight: '0.5rem' }} />
                                <input
                                    type="text"
                                    placeholder="Filter by Player ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ border: 'none', background: 'transparent', outline: 'none', color: theme.textMain, width: '150px' }}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <p style={{ color: theme.primary, textAlign: 'center', padding: '2rem' }}>Loading predictions...</p>
                        ) : predictions.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', color: theme.textMuted }}>
                                <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p style={{ margin: 0 }}>No prediction data found</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ color: theme.textMuted, borderBottom: `2px solid ${theme.border}` }}>
                                            <th style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>Player & Injury</th>
                                            <th style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>Target Days</th>
                                            <th style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>Confidence</th>
                                            <th style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>Validation</th>
                                            <th style={{ padding: '1rem 0.5rem', fontWeight: '500', textAlign: 'center' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {predictions.map(pred => (
                                            <tr key={pred._id} style={{ borderBottom: `1px solid ${theme.border}`, transition: 'background 0.2s' }}>
                                                <td style={{ padding: '1rem 0.5rem' }}>
                                                    <div style={{ fontWeight: '600', color: theme.textMain }}>
                                                        {MOCK_PLAYERS.find(p => p.id === String(pred.player?._id || pred.player))?.name || (pred.player ? String(pred.player?._id || pred.player).slice(-6) : 'Unknown Player')}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: theme.textMuted, marginTop: '0.2rem' }}>
                                                        {MOCK_INJURIES.find(i => i.id === String(pred.injury?._id || pred.injury))?.name || (pred.injury ? String(pred.injury?._id || pred.injury).slice(-6) : 'Unknown Injury')}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 0.5rem', color: theme.textMain }}>
                                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{pred.predictedDays}</span>
                                                    <div style={{ fontSize: '0.75rem', color: theme.textMuted }}>Range: {pred.recoveryRangeMin}-{pred.recoveryRangeMax}</div>
                                                </td>
                                                <td style={{ padding: '1rem 0.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', color: pred.confidenceScore > 75 ? theme.primary : theme.accentWarning, fontWeight: 'bold' }}>
                                                        <TrendingUp size={16} style={{ marginRight: '0.4rem' }} />
                                                        {pred.confidenceScore}%
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 0.5rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        backgroundColor: pred.status === 'Accurate' ? 'rgba(12, 232, 141, 0.1)' : pred.status === 'Inaccurate' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                        color: pred.status === 'Accurate' ? theme.primary : pred.status === 'Inaccurate' ? theme.accentDanger : theme.accentWarning,
                                                        border: `1px solid ${pred.status === 'Accurate' ? theme.primary : pred.status === 'Inaccurate' ? theme.accentDanger : theme.accentWarning}`
                                                    }}>
                                                        {pred.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                                                    <button onClick={() => handleEdit(pred)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textMuted, marginRight: '0.75rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = theme.textMuted}>
                                                        <Edit size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(pred._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textMuted, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = theme.accentDanger} onMouseOut={(e) => e.target.style.color = theme.textMuted}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictionsPage;
