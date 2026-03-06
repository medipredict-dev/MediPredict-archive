const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/player-profile', require('./routes/playerProfileRoutes'));
app.use('/api/coach', require('./routes/coachRoutes'));
app.use('/api/medical', require('./routes/medicalRoutes'));
app.use('/api/training-load', require('./routes/trainingLoadRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));

// Root route
app.get('/', (req, res) => {
    res.send('RecoverAI API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
