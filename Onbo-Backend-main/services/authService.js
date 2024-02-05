const User = require('../models/user');
const AdminProfile = require('../models/adminProfile');
const InstituteAdminProfile = require('../models/instituteAdminProfile');
const BranchAdminProfile = require('../models/branchAdminProfile');
const StudentProfile = require('../models/studentProfile');
const DriverProfile = require('../models/driverProfile');
const Branch = require('../models/branch');
const Institute = require('../models/institute');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};


const generateOTP = () => {
  const randomOTP = Math.floor(100000 + Math.random() * 900000).toString();
  return randomOTP;
};

const generateToken = (user) => {
  const tokenPayload = {
    userId: user._id,
    mobileNumber: user.mobileNumber,
    role: user.role,
  };

  switch (user.role) {

    case 'admin':
      if (user.adminProfile) {
        tokenPayload.instituteId = user.adminProfile.instituteId;
        tokenPayload.branchId = user.adminProfile.branchId;
      }
      break;

    case 'branchAdmin':
      if (user.branchAdminProfile) {
        tokenPayload.instituteId = user.branchAdminProfile.instituteId;
        tokenPayload.branchId = user.branchAdminProfile.branchId;
      }
      break;

    case 'instituteAdmin':
      if (user.instituteAdminProfile) {
        tokenPayload.instituteId = user.instituteAdminProfile.instituteId;
        tokenPayload.branchId = user.instituteAdminProfile.branchId;
      }
      break;

    case 'student':
      if (user.studentProfile) {
        tokenPayload.instituteId = user.studentProfile.instituteId;
        tokenPayload.branchId = user.studentProfile.branchId;
      }
      break;

    case 'driver':
      if (user.driverProfile) {
        tokenPayload.instituteId = user.driverProfile.instituteId;
        tokenPayload.branchId = user.driverProfile.branchId;
      }
      break;

    default:
      break;
  }

  const expiresIn = 900;
  const expiryDatetime = new Date(Date.now() + expiresIn * 1000);

  const access_token = jwt.sign(tokenPayload, config.secretKey, {

    // const access_token = jwt.sign(tokenPayload, config.secretKey, {
    //   expiresIn
  });

  const refresh_token = jwt.sign(tokenPayload, config.secretKey, {
    expiresIn: 604800,
  });
  return {
    access_token: access_token,
    refresh_token,
    expires_in: expiresIn,
    expiry_datetime: expiryDatetime,
  };
};

const refreshAccessToken = (oldTokenPayload) => {

  const { userId, mobileNumber, role } = oldTokenPayload;


  const newAccessToken = jwt.sign({ userId, mobileNumber, role }, config.secretKey, {
    expiresIn: 3600,
  });

  return { access_token: newAccessToken };
};

const verifyOTP = async (mobileNumber, enteredOTP, isRegistration = false, isLogin = false) => {
  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return { status: false, message: 'Invalid mobileNumber' };
    }

    // const hardcodedOTP = '123456';

    const otpField = isRegistration ? 'registrationOTP' : null;

    if (!otpField) {
      return { status: false, message: 'Invalid verification type' };
    }

    if (enteredOTP !== user[otpField]) {
      return { status: false, message: 'Invalid OTP' };
    }


    if (user.isVerified && isRegistration) {
      return { status: false, message: 'User is already verified for registration' };
    }


    user.isVerified = isRegistration;
    user.registrationOTP = null;

    await user.save();

    if (isRegistration) {
      return { status: true, message: 'OTP verified for registration successfully' };
    }

    return { status: false, message: 'Invalid verification type' };
  } catch (error) {
    console.error(error);
    return { status: false, message: 'Error during OTP verification' };
  }
};


const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  DRIVER: 'driver',
  BRANCH_ADMIN: 'branchAdmin',
  INSTITUTE_ADMIN: 'instituteAdmin',
};

const getProfileModel = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return AdminProfile;
      case ROLES.INSTITUTE_ADMIN:
        return InstituteAdminProfile;
    case ROLES.BRANCH_ADMIN:
      return BranchAdminProfile;
    case ROLES.STUDENT:
      return StudentProfile;
    case ROLES.DRIVER:
      return DriverProfile;
    default:
      return null;
  }
};

const registerUser = async ({ mobileNumber, role, firstName, lastName, pid, password }) => {
  try {

    const existingUser = await User.findOne({ mobileNumber }).exec();

    if (existingUser) {
      return { success: false, message: 'User with the same mobile number already exists.' };
    }

    const ProfileModel = getProfileModel(role);

    if (!ProfileModel) {
      return { status: false, message: 'Invalid role.' };
    }

    const existingProfile = await ProfileModel.findOne({
      [`${role.toLowerCase()}Pid`]: new RegExp(`^${pid}$`, 'i'),
    }).exec();

    if (existingProfile) {
      console.log(`Found existing profile with ${role} PID: ${existingProfile[`${role.toLowerCase()}Pid`]}`);
      return { status: false, message: `User with the same ${role} PID already exists.` };
    }

    const branch = await Branch.findOne().sort({ createdAt: -1 }).lean().exec()
    const institute = await Institute.findOne().sort({ createdAt: -1 }).lean().exec()

    const instituteId = institute._id;
    const branchId = branch._id;
    // if (!branch || !institute) {
    //   return { status: false, message: 'Invalid institute or branch ID.' };
    // }


    let userProfile;

    switch (role) {
      case ROLES.ADMIN:
        const existingAdminProfile = await AdminProfile.findOne({ employeePid: pid }).exec();

        if (existingAdminProfile) {
          return { status: false, message: `User with the same ${role} PID already exists.` };
        }
        userProfile = new AdminProfile({
          employeePid: pid,
          firstName,
          lastName,
          instituteId,
          branchId,
        });
        break;
      case ROLES.INSTITUTE_ADMIN:
        userProfile = new InstituteAdminProfile({
          employeePid: pid,
          firstName,
          lastName,
          instituteId,
          // branchId,
        });
        break;
      case ROLES.BRANCH_ADMIN:
        userProfile = new BranchAdminProfile({
          employeePid: pid,
          firstName,
          lastName,
          instituteId,
          branchId,
        });
        break;
      case ROLES.STUDENT:
        userProfile = new StudentProfile({
          studentPid: pid,
          firstName,
          lastName,
          instituteId,
          branchId,
        });
        break;
      case ROLES.DRIVER:
        userProfile = new DriverProfile({
          driverPid: pid,
          firstName,
          lastName,
          instituteId,
          branchId,
        });
        break;
      default:
        return { status: false, message: 'Invalid role.' };
    }

    await userProfile.save();

    const registrationOTP = generateOTP();
    console.log('Generated OTP:', registrationOTP);

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return { status: false, message: 'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new User({
      mobileNumber,
      role,
      registrationOTP,
      [`${role}Profile`]: userProfile._id,
      password: hashedPassword,
    });


    await user.save();


    const registeredUser = await User.findById(user._id).populate(`${role}Profile`).populate('userDevices').select('-otp').exec();

    if (registeredUser.isVerified) {

      if (registeredUser.otp) {
        registeredUser.otp = undefined;
        await registeredUser.save();
      }
    }
    return { status: true, message: 'Registration successful. OTP verified.' }; 
  } catch (error) {
    console.error(error);
    return { status: false, message: 'Registration failed.' };
  }
};

const loginUser = async (mobileNumber, password) => {
  try {
    const user = await User.findOne({ mobileNumber }).select('+password -registrationOTP -isLogged')
      .populate('adminProfile')
      .populate('branchAdminProfile')
      .populate('studentProfile')
      .populate('driverProfile')
      .populate('faceRecords')
      .populate('userDevices')
      .exec();

    if (!user) {
      return { status: 'Invalid login credentials' };
    }

    if (!user.isVerified) {
      return { status: 'User not verified. Please verify your account with OTP.' };
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return { status: 'Invalid login credentials' };
    }

    const { password: excludedPassword, ...users } = user.toObject();
    const token = generateToken(user);

    return {
      status: true,
      message: 'Login successful',
      data: {
        users,
        token,
      },
    };

  } catch (error) {
    console.error(error);
    return { status: 'Error during login' };
  }
};

module.exports = {
  registerUser,
  ROLES,
  verifyOTP,
  loginUser,
  generateToken,
  refreshAccessToken,
};
