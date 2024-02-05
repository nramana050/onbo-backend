const express = require('express');
const busController = require('../controllers/busController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/bus', authenticateToken(['branchAdmin']), busController.createBus);
router.get('/bus', authenticateToken([ 'student', 'driver', 'branchAdmin','instituteAdmin']), busController.getAllBuses);
router.get('/bus/:id', authenticateToken([ 'student', 'driver', 'branchAdmin','instituteAdmin']), busController.getBusesById);
router.put('/bus/:id', authenticateToken(['branchAdmin']), busController.updateBusTripRoute);

// Todo: delete by id
module.exports = router;
