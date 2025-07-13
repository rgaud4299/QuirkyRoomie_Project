const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies from incoming requests

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes (✅ using relative paths)
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server listen port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Cron job: Auto-archive downvoted complaints older than 3 days
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily task to archive old downvoted complaints...');
    const Complaint = require('./models/Complaint');

    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const result = await Complaint.updateMany(
            {
                downvotes: { $gt: 0 },
                resolved: false,
                downvotedAt: { $lte: threeDaysAgo },
            },
            {
                $set: {
                    resolved: true,
                    description: "This complaint has been automatically archived due to low community support.",
                },
            }
        );

        console.log(`Archived ${result.modifiedCount} downvoted complaints.`);
    } catch (error) {
        console.error('Error during auto-archiving:', error);
    }
});
