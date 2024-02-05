const mongoose = require('mongoose');

const faceDataSchema = new mongoose.Schema({
    faceProfile: { type: [Number], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

}, { timestamps: true });

const FaceRecord = mongoose.model('FaceRecord', faceDataSchema);

module.exports = FaceRecord;
