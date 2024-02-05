const admin = require('firebase-admin');

const sendPushNotificationService = async (tokens, payload) => {
  try {
    if (!tokens || tokens.length === 0) {
      console.error('Error: Empty or invalid tokens array.');
      return;
    }

    const message = {
      tokens,
      notification: { ...payload, title: 'Onbo' } || {},
    };
    const response = await admin.messaging().sendEachForMulticast(message);
    return response;
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
};

module.exports = {
  sendPushNotificationService,
};
