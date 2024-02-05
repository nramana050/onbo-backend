const mongoose = require('mongoose');

const instituteAdminSchema = new mongoose.Schema({
  employeePid: { type: String, required: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  // branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  isActive: { type: Boolean, default: true }, 
  isDeleted: { type: Boolean, default: false }, 
}, { timestamps: true });

const instituteAdminProfile = mongoose.model('InstituteAdminProfile', instituteAdminSchema);

module.exports = instituteAdminProfile;
