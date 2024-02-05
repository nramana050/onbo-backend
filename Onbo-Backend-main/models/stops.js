const mongoose = require('mongoose');

const stopsSchema = new mongoose.Schema({
  stopName: { type: String, required: true },
  tripRouteId: { type: mongoose.Schema.Types.ObjectId, ref: 'TripRoute' },
  stopCoordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  isActive: { type: Boolean, default: true }, 
  isDeleted: { type: Boolean, default: false }, 
  
}, { timestamps: true });

const Stops = mongoose.model('Stops', stopsSchema);

module.exports = Stops;
