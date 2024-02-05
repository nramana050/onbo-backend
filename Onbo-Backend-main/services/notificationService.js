const Notification = require('../models/notification');
const Branch = require('../models/branch');
const User = require('../models/user');
const UserDevice = require('../models/userDevice');
const SendPushNotification = require('./pushNotificationService');

const getAdminIds = async (branchId) => {
  try {
    const branch = await Branch.findById(branchId);
    return branch.adminIds;
  } catch (error) {
    console.error('Error retrieving adminIds:', error);
    throw error;
  }
}

const getUserIds = async (adminIds) => {
  try {
    const users = await User.find({ _id: { $in: adminIds } });
    return users.map((user) => user._id);
  } catch (error) {
    console.error('Error retrieving userIds:', error);
    throw error;
  }
}

const getUserDevices = async (userIds) => {
  try {
    const userDevices =
      (await UserDevice.find({ userId: { $in: userIds } })) || [];
    return userDevices;
  } catch (error) {
    console.error('Error retrieving userDevices:', error);
    return [];
  }
}

const createNotifications = async (user, notificationsList) => {
  console.log('notificationsList:', notificationsList);


  try {
    const { _id: senderId, role: senderType } = user;

    let instituteId, branchId;

    if (user.instituteAdminProfile) {
      instituteId = user.instituteAdminProfile.instituteId;
      branchId = user.instituteAdminProfile.branchId;
    } else if (user.branchAdminProfile) {
      instituteId = user.branchAdminProfile.instituteId;
      branchId = user.branchAdminProfile.branchId;
    } else if (user.studentProfile) {
      instituteId = user.studentProfile.instituteId;
      branchId = user.studentProfile.branchId;
    } else if (user.driverProfile) {
      instituteId = user.driverProfile.instituteId;
      branchId = user.driverProfile.branchId;
    }



    const adminIds = await getAdminIds(branchId);
    if (adminIds.length === 0 || notificationsList.length === 0) {
      // No adminIds or notifications to process
      return {
        status: true,
        message: 'No notifications to create',
        data: {},
      };
    }

    const userIds = await getUserIds(adminIds);
    const userDevices = await getUserDevices(userIds);

    const deviceTokens = userDevices
      .map((device) => device.deviceToken)
      .filter(Boolean);

    console.log('getUserDevices - userDevices:', userDevices);


    for (const notificationData of notificationsList) {
      if (notificationData && notificationData.messageType) {

        let message = ""

        switch (notificationData.messageType) {
          case 'SPEED_ALERT':
            message = 'Driver exceeds speed limit'
            break;
          case 'GPS_NOT_FOUND':
            message = 'GPS signal lost'
            break;
          case '15_MINS_FROM_STOP':
            message = 'GPS not found. Please check the device.'
            break;

          default:
            break;
        }

        for (const adminId of adminIds) {
          const adminNotification = {
            senderId,
            senderType,
            receiverId: adminId,
            receiverType: 'branchAdmin',
            messageType: notificationData.messageType,
            message,
            isRead: notificationData.isRead || false,
            isActive: notificationData.isActive || true,
            isDeleted: notificationData.isDeleted || false,
            instituteId,
            branchId,
          };

          const notification = new Notification(adminNotification);
          const savedNotification = await notification.save();
          console.log('Saved Notification:', savedNotification);

          const pushNotificationPayload = {
            body: message,
            data: {},
          };

          console.log('createNotifications - deviceTokens:', deviceTokens);
          await SendPushNotification.sendPushNotificationService(
            deviceTokens,
            pushNotificationPayload
          );
          console.log('Push notification sent successfully');

        }
      } else {
        console.warn('Skipping invalid notification:', notificationData);
        console.log('Complete Notification Data:', notificationData);
      }
    }


    return {
      status: true,
      message: 'Notifications created successfully',
      data: {},
    };
  } catch (error) {
    console.error('Error in Creating Notifications:', error);
    return {
      status: false,
      message: error.message || 'Internal Server Error',
      data: {},
    };
  }
};



module.exports = {
  createNotifications,
};
