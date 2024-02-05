const express = require('express');
const router = express.Router();
const branchAdminController = require('../controllers/branchAdminController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/branch-admin', authenticateToken(['instituteAdmin']), branchAdminController.getAllBranchAdmins);
// router.get('/branch-admin/:id', authenticateToken(['instituteAdmin', 'branchAdmin']), branchAdminController.getBranchAdminById);

module.exports = router;