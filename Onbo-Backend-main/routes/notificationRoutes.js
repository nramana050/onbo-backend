const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/notifications', authenticateToken(['admin', 'student', 'driver', 'branchAdmin','instituteAdmin']), notificationController.createNotifications);
router.get('/notifications', authenticateToken(['admin', 'student', 'driver', 'branchAdmin','instituteAdmin']), notificationController.getAllNotifications);
router.get('/notifications/:id', authenticateToken(['admin', 'student', 'driver', 'branchAdmin','instituteAdmin']), notificationController.getNotificationById);
router.put('/notifications/:id', authenticateToken(['admin', 'student', 'driver', 'branchAdmin','instituteAdmin']), notificationController.updateNotification);

module.exports = router;
