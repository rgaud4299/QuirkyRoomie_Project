const mongoose = require('mongoose');

const ComplaintSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        complaintType: {
            type: String,
            required: true,
            enum: ['Noise', 'Cleanliness', 'Bills', 'Pets', 'Other'], // Enforce specific types
        },
        severityLevel: {
            type: String,
            required: true,
            enum: ['Mild', 'Annoying', 'Major', 'Nuclear'], // Enforce specific levels
        },
        filedBy: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User who filed the complaint
            required: true,
            ref: 'User', // Refers to the 'User' model
        },
        flatCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        downvotes: {
            type: Number,
            default: 0,
        },
        resolved: {
            type: Boolean,
            default: false,
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User who resolved it
            ref: 'User',
            default: null,
        },
        // For auto-archiving downvoted complaints
        downvotedAt: {
            type: Date,
            default: null,
        },
        // Arrays to store user IDs who upvoted/downvoted to prevent multiple votes
        upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        // Field to store suggested punishment
        suggestedPunishment: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

const Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;

