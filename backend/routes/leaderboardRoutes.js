const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get karma points ranking (Leaderboard)
// @route   GET /api/leaderboard
// @access  Private
router.get(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        // Find all users in the authenticated user's flat and sort by karma points
        const leaderboard = await User.find({ flatCode: req.user.flatCode })
            .select('name karmaPoints') // Select only name and karmaPoints
            .sort({ karmaPoints: -1, name: 1 }); // Sort by karmaPoints (desc), then by name (asc)

        res.status(200).json(leaderboard);
    })
);

// @desc    Get complaint statistics for the flat
// @route   GET /api/leaderboard/stats
// @access  Private
router.get(
    '/stats',
    protect,
    asyncHandler(async (req, res) => {
        const flatCode = req.user.flatCode;

        // Total complaints filed in the flat
        const totalComplaints = await Complaint.countDocuments({ flatCode });

        // Top complaint categories
        const topCategories = await Complaint.aggregate([
            { $match: { flatCode: flatCode, resolved: false } }, // Match complaints for the flat and not resolved
            { $group: { _id: '$complaintType', count: { $sum: 1 } } }, // Group by complaintType and count
            { $sort: { count: -1 } }, // Sort by count descending
            { $limit: 3 } // Get top 3 categories
        ]);

        // Users with most complaints filed against them (most downvoted complaints)
        // This is a simplified approach. A more robust solution might track "complaints received" per user.
        // For now, we'll count how many times a user's complaint has been downvoted.
        const usersWithMostComplaintsAgainstThem = await Complaint.aggregate([
            { $match: { flatCode: flatCode, resolved: false, downvotes: { $gt: 0 } } },
            { $group: { _id: '$filedBy', totalDownvotes: { $sum: '$downvotes' } } },
            { $sort: { totalDownvotes: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users', // The collection to join from
                    localField: '_id', // Field from the input documents
                    foreignField: '_id', // Field from the "users" documents
                    as: 'user' // Output array field
                }
            },
            { $unwind: '$user' }, // Deconstructs the user array field from the input documents to output a document for each element.
            { $project: { _id: 0, name: '$user.name', totalDownvotes: 1 } } // Project desired fields
        ]);

        // Flatmate Problem of the Week (most upvoted active complaint)
        const flatmateProblemOfTheWeek = await Complaint.findOne({
            flatCode: flatCode,
            resolved: false,
            upvotes: { $gt: 0 }
        })
            .populate('filedBy', 'name')
            .sort({ upvotes: -1, createdAt: -1 });

        res.status(200).json({
            totalComplaints,
            topCategories,
            usersWithMostComplaintsAgainstThem,
            flatmateProblemOfTheWeek,
        });
    })
);

module.exports = router;
