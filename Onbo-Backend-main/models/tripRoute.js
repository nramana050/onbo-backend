const mongoose = require('mongoose');

const tripRouteSchema = new mongoose.Schema({
  tripRouteName: { type: String, required: true },
  stopsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stops',required: false, default: null }],
  isActive: { type: Boolean, default: true }, 
  isDeleted: { type: Boolean, default: false }, 
  
}, { timestamps: true });

const TripRoute = mongoose.model('TripRoute', tripRouteSchema);

module.exports = TripRoute;
