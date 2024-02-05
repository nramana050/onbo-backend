const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  studentPid: { type: String, required: true }, 
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  stopsId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stops',required: false, default: null },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus',required: false, default: null },
  isActive: { type: Boolean, default: true }, 
  isDeleted: { type: Boolean, default: false }, 
}, { timestamps: true });

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

module.exports = StudentProfile;
