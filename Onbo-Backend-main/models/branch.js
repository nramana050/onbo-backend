const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const branchSchema = new Schema({
  name: { type: String, required: true},
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  adminIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true }, 
  isDeleted: { type: Boolean, default: false }, 
 
}, { timestamps: true });

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;
