const mongoose = require('mongoose');

const userDeviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceToken: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }, 
  isDeleted: { type: Boolean, default: false }, 
}, { timestamps: true });

const UserDevice = mongoose.model('UserDevice', userDeviceSchema);

module.exports = UserDevice;
