const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    reviewerType: { type: String, enum: ['student', 'driver'] },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    targetType: { type: String, enum: ['student', 'driver'] },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Review', reviewSchema);
