const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, // Remove whitespace from both ends of a string
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensure email is unique
            lowercase: true, // Store emails in lowercase
            trim: true,
            match: [/.+@.+\..+/, 'Please fill a valid email address'], // Basic email validation
        },
        password: {
            type: String,
            required: true,
        },
        flatCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true, // Store flat codes in uppercase
        },
        karmaPoints: {
            type: Number,
            default: 0, // Initialize karma points to 0
        },
        // You might want to add a field for the "Best Flatmate" badge later
        bestFlatmateBadge: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps automatically
    }
);

// Pre-save hook to hash the password before saving a new user or updating password
UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        next();
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10); // 10 rounds is a good balance for security and performance
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
