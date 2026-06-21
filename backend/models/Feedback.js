const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['bug', 'feature', 'general', 'support'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'ignored'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
