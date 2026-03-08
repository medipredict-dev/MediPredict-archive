import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import './Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Player');
    const [coaches, setCoaches] = useState([]);
    const [coachId, setCoachId] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users/coaches');
                setCoaches(res.data);
            } catch (err) {
                console.error('Failed to fetch coaches', err);
            }
        };
        fetchCoaches();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                roleName: role,
                coachId: role === 'Player' ? coachId : undefined
            });

            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="register-page">
            {/* Left Panel - Holographic */}
            <div className="register-left">
                <div className="register-left-logo">
                    <Activity className="brand-icon" size={24} />
                    <span className="brand-text">
                        Medi<span className="brand-highlight">Predict</span>
                    </span>
                </div>

                <div className="register-left-content">
                    <h1 className="register-left-title">
                        Predict Recovery.<br />
                        <span className="highlight">Plan Performance.</span>
                    </h1>
                    <p className="register-left-subtitle">
                        Join thousands of athletes, coaches, and medical professionals using AI-powered recovery predictions.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="register-right">
                <div className="register-form-wrapper">
                    <Link to="/" className="register-back-link">
                        <ArrowLeft size={16} />
                        Back to website
                    </Link>

                    <h2 className="register-heading">Create an account</h2>
                    <p className="register-subtext">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>

                    {error && <p className="register-error">{error}</p>}

                    <form onSubmit={handleRegister} className="register-form">
                        <div className="register-form-row">
                            <div className="register-field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="register-field">
                                <label>Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => {
                                        setRole(e.target.value);
                                        if (e.target.value !== 'Player') setCoachId('');
                                    }}
                                >
                                    <option value="Player">Player</option>
                                    <option value="Coach">Coach</option>
                                    <option value="Medical">Medical Staff</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        {role === 'Player' && (
                            <div className="register-field" style={{ marginBottom: '1.5rem' }}>
                                <label>Select Your Coach</label>
                                <select
                                    value={coachId}
                                    onChange={(e) => setCoachId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a Coach --</option>
                                    {coaches.map(c => (
                                        <option key={c._id} value={c._id}>{c.name} {c.team ? `(${c.team})` : ''}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="register-field">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label>Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="register-submit">
                            Create account
                        </button>
                    </form>

                    <p className="register-terms">
                        By creating an account, you agree to our{' '}
                        <a href="#">Terms of Service</a> and{' '}
                        <a href="#">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
