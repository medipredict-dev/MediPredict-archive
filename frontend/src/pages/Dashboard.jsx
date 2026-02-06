import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return <p>Loading...</p>;

    // Helper to safely get role display
    const getRoleDisplay = () => {
        if (!user.roles) return 'No Role';
        // If roles is an array of objects (Module 2)
        if (Array.isArray(user.roles) && typeof user.roles[0] === 'object') {
            return user.roles.map(r => r.name).join(', ');
        }
        // If roles is just a string or array of strings (Module 1 backward compat)
        if (Array.isArray(user.roles)) return user.roles.join(', ');
        return user.role || 'Unknown';
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>RecoverAI Dashboard</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </header>

            <div style={styles.content}>
                <h2>Welcome, {user.name}!</h2>
                <div style={styles.card}>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {getRoleDisplay()}</p>
                    <p><strong>User ID:</strong> {user._id || user.id}</p>
                    <div style={styles.tokenBox}>
                        <p><strong>Your Session Token:</strong></p>
                        <code style={styles.token}>{user.token}</code>
                    </div>
                </div>

                <div style={styles.infoBox}>
                    {user.roles && JSON.stringify(user.roles).includes('Admin') &&
                        <p style={{ color: 'red', fontWeight: 'bold' }}>You have Admin Privileges</p>
                    }
                    {user.roles && JSON.stringify(user.roles).includes('Player') &&
                        <p style={{ color: 'blue' }}>View your Injury Predictions here.</p>
                    }
                </div>

                {/* Role-based Dashboard Links */}
                <div style={styles.dashboardLinks}>
                    <h3>Quick Access</h3>
                    {user.roles && (JSON.stringify(user.roles).includes('Coach') || JSON.stringify(user.roles).includes('Admin')) && (
                        <a href="/coach-dashboard" style={styles.dashboardLink}>
                            🏆 Go to Coach Dashboard
                        </a>
                    )}
                    {user.roles && (JSON.stringify(user.roles).includes('Medical') || JSON.stringify(user.roles).includes('Admin')) && (
                        <a href="/medical-dashboard" style={styles.dashboardLink}>
                            🏥 Go to Medical Dashboard
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '20px',
        marginBottom: '20px'
    },
    logoutBtn: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    content: {
        maxWidth: '800px',
        margin: '0 auto'
    },
    card: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
    },
    tokenBox: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        overflowX: 'auto'
    },
    token: {
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    infoBox: {
        marginTop: '20px',
        padding: '15px',
        borderLeft: '4px solid #007bff',
        backgroundColor: '#f1f8ff'
    },
    dashboardLinks: {
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    dashboardLink: {
        display: 'block',
        padding: '12px 20px',
        marginTop: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        textAlign: 'center'
    }
};

export default Dashboard;
