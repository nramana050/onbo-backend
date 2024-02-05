const express = require('express');
const router = express.Router();
const deviceTokenController = require('../controllers/deviceTokenController');

router.post('/device', deviceTokenController.saveDeviceToken);

module.exports = router;
