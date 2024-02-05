const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },
    onboardLocation: {
        latitude: { type: Number, required: false },
        longitude: { type: Number, required: false },
    },
    onboardDate: { type: Date, default: Date.now },
    offboardLocation: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
    },
    offboardDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
