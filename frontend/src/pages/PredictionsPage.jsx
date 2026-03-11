import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Clock, TrendingUp, ActivitySquare, AlertCircle, Save, X, Edit, Trash2, Search } from 'lucide-react';

const PredictionsPage = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dynamic dropdown state
    const [players, setPlayers] = useState([]);
    const [injuries, setInjuries] = useState([]);

    // Gemini loading state
    const [generating, setGenerating] = useState(false);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState(null); // To show explanation

    const [formData, setFormData] = useState({
        player: '60d5ecb8b392d700153efabc', // Default dummy ObjectIds for testing
        injury: '60d5ecb8b392d700153efabd'
    });

    const [editId, setEditId] = useState(null);

    // Helper to get auth config from localStorage
    const getAuthConfig = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return {};
        const userData = JSON.parse(storedUser);
        return { headers: { Authorization: `Bearer ${userData.token}` } };
    };

    // Fetch all predictions
    const fetchPlayers = async () => {
        try {
            const config = getAuthConfig();
            // Uses the medical route to easily fetch all users with the "Player" role
            const res = await axios.get(`http://localhost:5000/api/medical/players`, config);
            setPlayers(res.data);

            // Default select the first player if no form data is set
            if (res.data.length > 0 && formData.player === '60d5ecb8b392d700153efabc') {
                setFormData(prev => ({ ...prev, player: res.data[0]._id }));
            }
        } catch (err) {
            console.error('Error fetching players:', err);
        }
    };

    const fetchInjuries = async () => {
        try {
            const config = getAuthConfig();
            // Fetch the global injuries list
            const res = await axios.get(`http://localhost:5000/api/medical/injuries`, config);
            setInjuries(res.data);

            // Default select the first injury
            if (res.data.length > 0 && formData.injury === '60d5ecb8b392d700153efabd') {
                setFormData(prev => ({ ...prev, injury: res.data[0]._id }));
            }
        } catch (err) {
            console.error('Error fetching injuries:', err);
        }
    };

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

    // Load data exactly once when the component initially mounts
    useEffect(() => {
        fetchPlayers();
        fetchInjuries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load predictions once
    useEffect(() => {
        fetchPredictions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Local filtering for search
    const filteredPredictions = predictions.filter(pred => {
        const playerName = pred.player?.name || 'Unknown';
        const playerID = pred.player?._id || pred.player || '';
        return playerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
               playerID.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                if (!window.confirm('Are you sure you want to update this prediction record?')) return;
                await axios.put(`http://localhost:5000/api/predictions/${editId}`, formData);
            } else {
                if (!window.confirm('Generate an AI prediction for this player and injury?')) return;
                setGenerating(true);
                await axios.post(`http://localhost:5000/api/predictions`, {
                    player: formData.player,
                    injury: formData.injury
                });
            }
            setFormData({
                player: players[0]?._id || '',
                injury: injuries[0]?._id || ''
            });
            setEditId(null);
            fetchPredictions();
        } catch (err) {
            console.error('Error saving prediction', err);
            alert(err.response?.data?.message || err.message || 'Failed to generate AI prediction.');
        } finally {
            setGenerating(false);
        }
    };

    const handleEdit = (pred) => {
        setEditId(pred._id);
        setFormData({
            player: pred.player?._id || pred.player || players[0]?._id || '',
            injury: pred.injury?._id || pred.injury || injuries[0]?._id || ''
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
            player: players[0]?._id || '',
            injury: injuries[0]?._id || ''
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

                <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ActivitySquare style={{ marginRight: '1rem', color: theme.primary }} size={32} />
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0, letterSpacing: '-0.5px' }}>
                            <span style={{ color: theme.textMain }}>AI </span>
                            <span style={{ color: theme.primary }}>Prediction Module</span>
                        </h1>
                    </div>
                    {/* Tooltip or small badge for model status */}
                    <div style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', background: 'rgba(12, 232, 141, 0.1)', border: `1px solid ${theme.primary}`, fontSize: '0.75rem', color: theme.primary }}>
                        Model: Random Forest + Gemini Explanation
                    </div>
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
                                    {players.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Control 2: Injury ID (Dropdown) */}
                            <div>
                                <label style={labelStyle}>Injury Category</label>
                                <select name="injury" value={formData.injury} onChange={handleInputChange} required style={inputStyle}>
                                    {injuries.map(i => (
                                        <option key={i._id} value={i._id}>{i.injuryType} - {i.bodyPart} ({i.severity})</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="submit"
                                    disabled={generating}
                                    style={{
                                        flex: 1, padding: '0.875rem',
                                        background: theme.primary, color: '#000',
                                        borderRadius: '8px', border: 'none',
                                        fontWeight: 'bold', fontSize: '1rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: generating ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                        boxShadow: `0 4px 15px rgba(12, 232, 141, 0.2)`,
                                        opacity: generating ? 0.6 : 1
                                    }}
                                    onMouseOver={(e) => !generating && (e.target.style.background = theme.primaryHover)}
                                    onMouseOut={(e) => !generating && (e.target.style.background = theme.primary)}
                                >
                                    <Save size={18} style={{ marginRight: '0.5rem' }} />
                                    {generating ? 'Generating AI Prediction...' : editId ? 'Update Record' : 'Generate Prediction'}
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
                                    placeholder="Search by Player Name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ border: 'none', background: 'transparent', outline: 'none', color: theme.textMain, width: '200px' }}
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
                                        {filteredPredictions.map(pred => (
                                            <React.Fragment key={pred._id}>
                                                <tr 
                                                    style={{ borderBottom: `1px solid ${theme.border}`, transition: 'background 0.2s', cursor: 'pointer' }}
                                                    onClick={() => setExpandedId(expandedId === pred._id ? null : pred._id)}
                                                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                                                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                                                >
                                                    <td style={{ padding: '1rem 0.5rem' }}>
                                                        <div style={{ fontWeight: '600', color: theme.textMain }}>
                                                            {/* Try to get name from populated object, else fallback to searching in players list */}
                                                            {pred.player?.name || 
                                                             players.find(p => p._id === String(pred.player?._id || pred.player))?.name || 
                                                             'Unknown Player'}
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: theme.textMuted, marginTop: '0.2rem' }}>
                                                            {(() => {
                                                                const inj = pred.injury?.injuryType 
                                                                    ? pred.injury 
                                                                    : injuries.find(i => i._id === String(pred.injury?._id || pred.injury));
                                                                return inj ? `${inj.injuryType} - ${inj.bodyPart}` : '-';
                                                            })()}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1rem 0.5rem', color: theme.textMain }}>
                                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{pred.predictedDays} days</span>
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
                                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleEdit(pred); }} 
                                                                title="Edit"
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textMuted }}
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(pred._id); }} 
                                                                title="Delete"
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textMuted }}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* Expanded Row for AI Explanation */}
                                                {expandedId === pred._id && (
                                                    <tr>
                                                        <td colSpan="5" style={{ padding: '0 0.5rem 1rem 0.5rem', backgroundColor: 'rgba(12, 232, 141, 0.03)' }}>
                                                            <div style={{ 
                                                                padding: '1.25rem', 
                                                                borderRadius: '8px', 
                                                                border: `1px dashed ${theme.primary}`, 
                                                                marginTop: '0.5rem',
                                                                fontSize: '0.9rem',
                                                                lineHeight: '1.6',
                                                                color: theme.textMain
                                                            }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', color: theme.primary, fontWeight: 'bold' }}>
                                                                    <Activity size={16} style={{ marginRight: '0.5rem' }} />
                                                                    Explainable AI Insights
                                                                </div>
                                                                {pred.explanation || "No detailed explanation available for this record."}
                                                                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: theme.textMuted, fontStyle: 'italic' }}>
                                                                    * This insight is generated by the AI Explanation Layer (Gemini-2.0-Flash) based on model metrics.
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
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
