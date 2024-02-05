const { string } = require('joi');
const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentIds: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: Date, default: Date.now },
  startCoordinates: {
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
  },
  rideStart: { type: String, enum: ['Not Started', 'Started'], default: 'Started' },
  endDate: { type: Date, default: Date.now },
  endCoordinates: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  rideEnd: { type: String, enum: ['Not Ended', 'Ended'], default: 'Not Ended' },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  tripRouteId: { type: mongoose.Schema.Types.ObjectId, ref: 'TripRoute' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rideType: { type: String, enum: ['PICKUP', 'DROP'] },
  // userDevices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDevice' }],
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },

}, { timestamps: true });

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;