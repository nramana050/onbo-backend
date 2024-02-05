const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// router.post('/request', authenticateToken(['admin']), adminController.assignDriverAndStudents);
router.post('/:busId/unAssign', authenticateToken(['admin']), adminController.removeDriverOrStudentFromBus);
// Todo  delete
module.exports = router;
