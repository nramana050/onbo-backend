const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderType: { type: String, enum: ['instituteAdmin','branchAdmin','student','guardian','driver'] },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref:'User'},
  receiverType: { type: String, enum: ['instituteAdmin','branchAdmin','student','guardian','driver']},
  messageType: {
    type: String,
    enum: [
      'ASSIGN_BUS_TO_DRIVER_BY_ADMIN',
      'ASSIGN_BUS_TO_STUDENT_BY_ADMIN',
      'CHANGE_ROUTE_REQUEST_BY_STUDENT',
      'CHANGE_BUS_REQUEST_BY_STUDENT',
      'CHANGE_BUS_REQUEST_BY_DRIVER',
      'CHANGE_ROUTE_REQUEST_BY_DRIVER',
      'SPEED_ALERT',
      'GPS_NOT_FOUND',
      '15_MINS_FROM_STOP',
      'BUS_STOP_REACHED',
    ],
    required: true,
  },
  message: { type: String },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: false },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: false },
  isRead: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }, 
  isDeleted: { type: Boolean, default: false }, 
},{ timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;