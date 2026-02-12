const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const Role = require('./models/Role');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Role.deleteMany();
        await User.deleteMany();

        const roles = [
            {
                name: 'Player',
                permissions: ['view_profile', 'view_predictions'],
                description: 'A sports player who uses the predictions.'
            },
            {
                name: 'Coach',
                permissions: ['view_team', 'view_all_predictions', 'manage_team'],
                description: 'A coach who manages players and views team stats.'
            },
            {
                name: 'Medical',
                permissions: ['view_all', 'edit_medical_records', 'add_injury'],
                description: 'Medical staff who manages injury data.'
            },
            {
                name: 'Admin',
                permissions: ['manage_users', 'manage_roles', 'full_access'],
                description: 'Administrator with full access.'
            }
        ];

        const createdRoles = await Role.insertMany(roles);

        const adminRole = createdRoles.find(r => r.name === 'Admin');
        const playerRole = createdRoles.find(r => r.name === 'Player');
        const coachRole = createdRoles.find(r => r.name === 'Coach');
        const medicalRole = createdRoles.find(r => r.name === 'Medical');

        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                roles: [adminRole._id]
            },
            {
                name: 'John Player',
                email: 'player@example.com',
                password: 'password123',
                roles: [playerRole._id],
                team: 'Raiders',
                position: 'Forward'
            },
            {
                name: 'Coach Williams',
                email: 'coach@example.com',
                password: 'password123',
                roles: [coachRole._id],
                team: 'Raiders'
            },
            {
                name: 'Dr. Sarah Medical',
                email: 'medical@example.com',
                password: 'password123',
                roles: [medicalRole._id]
            },
            {
                name: 'Mike Johnson',
                email: 'mike@example.com',
                password: 'password123',
                roles: [playerRole._id],
                team: 'Raiders',
                position: 'Midfielder'
            },
            {
                name: 'Alex Smith',
                email: 'alex@example.com',
                password: 'password123',
                roles: [playerRole._id],
                team: 'Raiders',
                position: 'Defender'
            }
        ];

        await User.create(users);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Role.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
