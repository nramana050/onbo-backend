const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/student', authenticateToken(['branchAdmin']), studentController.getAllStudents);
router.get('/student/:id', authenticateToken(['student','branchAdmin']), studentController.getStudentById);
router.put('/student/:id', authenticateToken(['student','branchAdmin']), studentController.updateStudentById);

// Todo: delete more than 1
module.exports = router;