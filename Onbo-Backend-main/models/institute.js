const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true},
  branchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null  }], 
  isActive: { type: Boolean, default: true }, 
  isDeleted: { type: Boolean, default: false }, 
 
}, { timestamps: true });

const Institute = mongoose.model('Institute', instituteSchema);

module.exports = Institute;
