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
            enum: ['Noise', 'Cleanliness', 'Bills', 'Pets', 'Other'],
        },
        severityLevel: {
            type: String,
            required: true,
            enum: ['Mild', 'Annoying', 'Major', 'Nuclear'],
        },
        filedBy: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
            ref: 'User', 
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
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            default: null,
        },
        downvotedAt: {
            type: Date,
            default: null,
        },
        upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        suggestedPunishment: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, 
    }
);

const Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;

