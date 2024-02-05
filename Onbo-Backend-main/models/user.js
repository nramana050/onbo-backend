  const mongoose = require('mongoose');
  
  const userSchema = new mongoose.Schema({
    mobileNumber: { type: String, required: true,unique: true},
    role: {
      type: String,
      required: true,
      enum: ['admin','instituteAdmin','branchAdmin','student','guardian','driver'],
    },
    adminProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminProfile' },
    instituteAdminProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'InstituteAdminProfile' },
    branchAdminProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'BranchAdminProfile' },
    studentProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' },
    driverProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'DriverProfile' },
    faceRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FaceRecord' }],
    otp: { type: String },  
    isVerified: { type: Boolean, default: false },
    registrationOTP: { type: String, default: null },
    userDevices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDevice' }],
    // isLogged: { type: Boolean, default: false },
    // refreshTokens: [{ type: String }],
    password: {
      type: String,
      required: true,
      select: false, 
    },
    isActive: { type: Boolean, default: true }, 
    isDeleted: { type: Boolean, default: false }, 

  }, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;
