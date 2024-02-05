const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/attendances',authenticateToken(['driver','branchAdmin','instituteAdmin','student']), attendanceController.getAllAttendances);
router.get('/attendances/:id',authenticateToken(['driver','branchAdmin','instituteAdmin','student']), attendanceController.getAttendanceById);
router.post('/attendances',authenticateToken(['driver']), attendanceController.createAttendance);
router.put('/attendances/:id',authenticateToken(['driver']), attendanceController.updateAttendance);
router.delete('/attendances/:id',authenticateToken(['driver','branchAdmin','instituteAdmin','student']), attendanceController.deleteAttendance);

module.exports = router;
