const deviceTokenService = require('../services/deviceTokenService');

const saveDeviceToken = async (req, res) => { 
  const { userId, deviceToken } = req.body;
  try {
    const result = await deviceTokenService.saveUserDevice(userId, deviceToken, new Date());

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  saveDeviceToken,
};
