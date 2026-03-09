const PlayerProfile = require('../models/PlayerProfile');
const Injury = require('../models/Injury');
const Prediction = require('../models/Prediction');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// @desc    Create player profile
// @route   POST /api/player-profile
// @access  Private (Player only)
const createPlayerProfile = async (req, res) => {
    try {
        const { age, playingRole, experienceYears, height, weight, pastInjuries } = req.body;

        // Check if profile already exists
        const profileExists = await PlayerProfile.findOne({ userId: req.user.id });

        if (profileExists) {
            return res.status(400).json({ message: 'Player profile already exists' });
        }

        const playerProfile = await PlayerProfile.create({
            userId: req.user.id,
            age,
            playingRole,
            experienceYears,
            height,
            weight,
            pastInjuries
        });

        res.status(201).json(playerProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current player's profile
// @route   GET /api/player-profile/me
// @access  Private (Player only)
const getPlayerProfile = async (req, res) => {
    try {
        const profile = await PlayerProfile.findOne({ userId: req.user.id });

        if (profile) {
            res.status(200).json(profile);
        } else {
            res.status(404).json({ message: 'Player profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update player profile
// @route   PUT /api/player-profile/me
// @access  Private (Player only)
const updatePlayerProfile = async (req, res) => {
    try {
        const profile = await PlayerProfile.findOne({ userId: req.user.id });

        if (profile) {
            profile.age = req.body.age || profile.age;
            profile.playingRole = req.body.playingRole || profile.playingRole;
            profile.experienceYears = req.body.experienceYears || profile.experienceYears;
            profile.height = req.body.height || profile.height;
            profile.weight = req.body.weight || profile.weight;
            profile.pastInjuries = req.body.pastInjuries || profile.pastInjuries;

            const updatedProfile = await profile.save();
            res.json(updatedProfile);
        } else {
            res.status(404).json({ message: 'Player profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get player's own injuries
// @route   GET /api/player-profile/injuries
// @access  Private (Player only)
const getPlayerInjuries = async (req, res) => {
    try {
        const injuries = await Injury.find({ playerId: req.user._id })
            .populate('addedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(injuries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Player submits a new injury
// @route   POST /api/player-profile/injuries
// @access  Private (Player only)
const addPlayerInjury = async (req, res) => {
    try {
        const {
            injuryType,
            bodyPart,
            severity,
            description,
            dateOfInjury,
            painLevel
        } = req.body;

        // Calculate risk level based on severity
        let riskLevel = 'Low';
        if (severity === 'Severe' || severity === 'Critical') {
            riskLevel = 'High';
        } else if (severity === 'Moderate') {
            riskLevel = 'Medium';
        }

        // Get player profile for AI context
        const playerProfile = await PlayerProfile.findOne({ userId: req.user._id });

        // Create the injury record first
        const injury = await Injury.create({
            playerId: req.user._id,
            injuryType,
            bodyPart,
            severity,
            description,
            dateOfInjury: dateOfInjury || Date.now(),
            painLevel,
            status: 'Active',
            addedBy: req.user._id,
            riskLevel
        });

        // --- AI PREDICTION USING GEMINI ---
        let aiPrediction = null;
        let predictionRecord = null;

        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error('GEMINI_API_KEY not configured');
            }

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            // Build context-aware prompt
            const prompt = `You are an expert sports medicine AI specialized in athlete recovery prediction.
            Analyze the following injury data and predict the recovery timeline.
            
            ${playerProfile ? `Athlete Profile:
            - Age: ${playerProfile.age || 'Unknown'}
            - Playing Role: ${playerProfile.playingRole || 'Unknown'}
            - Experience: ${playerProfile.experienceYears || 'Unknown'} years
            - Height: ${playerProfile.height || 'N/A'} cm
            - Weight: ${playerProfile.weight || 'N/A'} kg
            - Past Injuries: ${playerProfile.pastInjuries?.length > 0 ? playerProfile.pastInjuries.join(', ') : 'None documented'}` : 'Athlete Profile: Not available'}
            
            Current Injury Details:
            - Injury Type: ${injuryType}
            - Affected Body Part: ${bodyPart}
            - Severity: ${severity}
            - Description: ${description}
            - Pain Level (1-10): ${painLevel || 'Not specified'}
            - Date of Injury: ${dateOfInjury || 'Today'}
            
            Based on medical research and sports medicine best practices, provide your prediction.
            Return ONLY a valid JSON object (no markdown, no code blocks) with exactly these keys:
            {
              "predictedDays": <integer - most likely days for full recovery>,
              "recoveryRangeMin": <integer - minimum days for optimistic recovery>,
              "recoveryRangeMax": <integer - maximum days for pessimistic recovery>,
              "confidenceScore": <integer 0-100 - your confidence in this prediction>,
              "recommendations": <string - brief recovery recommendations>,
              "riskFactors": <string - any identified risk factors that could affect recovery>
            }`;

            console.log('🤖 Calling Gemini AI for prediction...');
            const result = await model.generateContent(prompt);
            let rawAnswer = result.response.text();

            // Clean any markdown formatting
            rawAnswer = rawAnswer.replace(/```json/g, '').replace(/```/g, '').trim();
            
            aiPrediction = JSON.parse(rawAnswer);
            console.log('✅ Gemini AI prediction:', aiPrediction);

            // Save prediction to database
            predictionRecord = await Prediction.create({
                player: req.user._id,
                injury: injury._id,
                predictedDays: aiPrediction.predictedDays,
                confidenceScore: aiPrediction.confidenceScore,
                recoveryRangeMin: aiPrediction.recoveryRangeMin,
                recoveryRangeMax: aiPrediction.recoveryRangeMax,
                predictionDate: new Date(),
                status: 'Pending'
            });

            // Update injury with AI predicted recovery days
            injury.predictedRecoveryDays = aiPrediction.predictedDays;
            injury.expectedRecoveryDays = aiPrediction.predictedDays;
            await injury.save();

        } catch (aiError) {
            console.warn('⚠️ AI prediction failed, using fallback:', aiError.message);
            
            // Fallback: Use smart estimates based on injury data
            const recoveryEstimates = {
                'Muscle Strain': { Minor: 7, Moderate: 21, Severe: 42, Critical: 60 },
                'Ligament Sprain': { Minor: 14, Moderate: 42, Severe: 90, Critical: 180 },
                'Fracture': { Minor: 42, Moderate: 60, Severe: 90, Critical: 120 },
                'Concussion': { Minor: 7, Moderate: 14, Severe: 30, Critical: 60 },
                'Tendinitis': { Minor: 14, Moderate: 28, Severe: 42, Critical: 60 },
                'Dislocation': { Minor: 21, Moderate: 42, Severe: 60, Critical: 90 },
                'Contusion': { Minor: 3, Moderate: 7, Severe: 14, Critical: 21 },
                'Other': { Minor: 7, Moderate: 14, Severe: 28, Critical: 42 }
            };
            
            const baseDays = recoveryEstimates[injuryType]?.[severity] || 14;
            const variability = Math.floor(baseDays * 0.15);
            
            aiPrediction = {
                predictedDays: baseDays,
                recoveryRangeMin: Math.max(1, baseDays - variability * 2),
                recoveryRangeMax: baseDays + variability * 3,
                confidenceScore: 70,
                recommendations: 'Follow standard recovery protocols. Consult with medical staff for personalized guidance.',
                riskFactors: 'Unable to perform AI analysis. Using standard medical estimates.'
            };

            injury.predictedRecoveryDays = aiPrediction.predictedDays;
            await injury.save();
        }

        const populatedInjury = await Injury.findById(injury._id)
            .populate('addedBy', 'name');

        // Return both injury and AI prediction
        res.status(201).json({
            injury: populatedInjury,
            prediction: aiPrediction,
            predictionId: predictionRecord?._id || null,
            aiPowered: predictionRecord !== null
        });
    } catch (error) {
        console.error('addPlayerInjury error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPlayerProfile,
    getPlayerProfile,
    updatePlayerProfile,
    getPlayerInjuries,
    addPlayerInjury
};
