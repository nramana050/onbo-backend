const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requesterType: { type: String, enum: ['admin', 'branchAdmin', 'student', 'driver'] },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accepterType: { type: String, enum: ['admin', 'branchAdmin', 'student', 'driver'] },
  accepterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  requestType: {
    type: String, enum: [
      'ADMIN_BUS_ASSIGNMENT_STUDENT',
      'ADMIN_BUS_ASSIGNMENT_DRIVER',
      'BUS_CHANGE_REQUEST_STUDENT',
      'BUS_CHANGE_REQUEST_DRIVER',
      'DRIVER_ADD_STOP',
      'DRIVER_REMOVE_STOP',
    ]
  },
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;

