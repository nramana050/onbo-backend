const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNo: { type: String, required: true,unique: true, },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  // driverId: { type: String,required: false, default: null },
  driverId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User',required: false, default: null},
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null  }], 
  tripRouteId: { type: mongoose.Schema.Types.ObjectId, ref: 'TripRoute' },
  userDevices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDevice' }],
  isActive: { type: Boolean, default: true }, 
  isDeleted: { type: Boolean, default: false }, 
  
}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
