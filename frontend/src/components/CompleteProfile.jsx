import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        playingRole: 'Batsman',
        experienceYears: '',
        height: '',
        weight: '',
        pastInjuries: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user should be here
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);

        // Check if user is a player (using new module 2 structure or module 1 backward compat)
        const isPlayer = Array.isArray(user.roles)
            ? user.roles.some(r => r.name === 'Player' || r === 'Player')
            : user.role === 'Player';

        if (!isPlayer) {
            setError('Only players need to complete a profile.');
            setTimeout(() => navigate('/dashboard'), 2000);
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(userStr);

        try {
            // Split past injuries by comma if it's not empty, otherwise empty array
            const injuriesArray = formData.pastInjuries
                ? formData.pastInjuries.split(',').map(i => i.trim())
                : [];

            const payload = {
                ...formData,
                pastInjuries: injuriesArray
            };

            await axios.post('http://localhost:5000/api/player-profile', payload, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            // Update local storage to reflect profile is created (optional but good UI practice)
            const updatedUser = { ...user, needsProfile: false };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Complete Your Player Profile</h2>
            <p style={styles.subtitle}>We need this information to generate accurate injury predictions.</p>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label>Age <span style={styles.required}>*</span></label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min="10"
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Playing Role <span style={styles.required}>*</span></label>
                    <select
                        name="playingRole"
                        value={formData.playingRole}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="Batsman">Batsman</option>
                        <option value="Bowler">Bowler</option>
                        <option value="All-rounder">All-rounder</option>
                        <option value="Wicketkeeper">Wicketkeeper</option>
                        <option value="Forward">Forward</option>
                        <option value="Midfielder">Midfielder</option>
                        <option value="Defender">Defender</option>
                    </select>
                </div>

                <div style={styles.inputGroup}>
                    <label>Experience (Years) <span style={styles.required}>*</span></label>
                    <input
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        required
                        min="0"
                        style={styles.input}
                    />
                </div>

                <div style={styles.row}>
                    <div style={styles.halfInput}>
                        <label>Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            placeholder="e.g. 180"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.halfInput}>
                        <label>Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="e.g. 75"
                            style={styles.input}
                        />
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <label>Past Injuries (comma separated)</label>
                    <textarea
                        name="pastInjuries"
                        value={formData.pastInjuries}
                        onChange={handleChange}
                        placeholder="e.g. ACL tear 2023, Ankle sprain 2024"
                        style={styles.textarea}
                        rows="3"
                    />
                </div>

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '500px',
        margin: '40px auto',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: '#fff',
        fontFamily: 'Arial, sans-serif'
    },
    subtitle: {
        color: '#666',
        marginBottom: '20px',
        fontSize: '0.9rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left'
    },
    row: {
        display: 'flex',
        gap: '15px'
    },
    halfInput: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left'
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    required: {
        color: 'red'
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '1rem'
    },
    select: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        backgroundColor: 'white'
    },
    textarea: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        resize: 'vertical'
    },
    button: {
        padding: '12px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '10px'
    },
    error: {
        color: '#dc3545',
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#ffe6e6',
        borderRadius: '4px',
        textAlign: 'center'
    }
};

export default CompleteProfile;
