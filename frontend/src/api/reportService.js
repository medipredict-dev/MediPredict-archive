import axios from 'axios';

// Get base URL depending on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create consistent axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
    (config) => {
        // Attempt to retrieve token from localStorage (assuming it's stored there upon login)
        // You may need to adjust "user" key to match how your app stores auth state
        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Report Services
 */
const reportService = {
    // Fetch Recovery Progress Data for current player (or pass ID for medical)
    getRecoveryProgress: async (playerId = '') => {
        const url = playerId ? `/reports/recovery-progress/${playerId}` : `/reports/recovery-progress`;
        const response = await api.get(url);
        return response.data;
    },

    // Fetch Team Availability Data (Coach only)
    getTeamAvailability: async () => {
        const response = await api.get('/reports/team-availability');
        return response.data;
    }
};

export default reportService;
