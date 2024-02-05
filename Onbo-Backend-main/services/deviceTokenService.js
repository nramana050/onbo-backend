const UserDevice = require('../models/userDevice');
const User = require('../models/user');


const saveUserDevice = async (userId, deviceToken, expirationDate) => {
  try {

    const user = await User.findById(userId);

    if (!user) {
      return { status: false, message: 'User not found.' };
    }


    const existingDevice = await UserDevice.findOne({ userId, deviceToken });

    if (existingDevice) {
      return { status: false, message: 'FCM token already exists for this user.' };
    }

    const userDevice = new UserDevice({
      userId,
      deviceToken,
      expirationDate,
    });

    await userDevice.save();

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { userDevices: userDevice._id } }, 
      { new: true } 
    ).exec();

    // const allTokens = await UserDevice.find({ userId }, { deviceToken: 1, expirationDate: 1 });

    return { status: true, message: 'User device saved successfully.', data: { userId, deviceToken} };
  } catch (error) {
    console.error(error);
    return { status: false, message: 'Failed to save user device.' };
  }
};

module.exports = {
  saveUserDevice,
};
