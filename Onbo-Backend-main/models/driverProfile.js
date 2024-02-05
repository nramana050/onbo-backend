const mongoose = require('mongoose');

const driverProfileSchema = new mongoose.Schema({
  driverPid: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus',required: false, default: null },
  isActive: { type: Boolean, default: true }, 
  isDeleted: { type: Boolean, default: false }, 
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const DriverProfile = mongoose.model('DriverProfile', driverProfileSchema);

module.exports = DriverProfile;
