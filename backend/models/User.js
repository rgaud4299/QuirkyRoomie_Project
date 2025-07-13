const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, 
        },
        email: {
            type: String,
            required: true,
            unique: true, 
            lowercase: true,
            trim: true,
            match: [/.+@.+\..+/, 'Please fill a valid email address'],
        },
        password: {
            type: String,
            required: true,
        },
        flatCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        karmaPoints: {
            type: Number,
            default: 0, 
        },
        bestFlatmateBadge: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, 
    }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
