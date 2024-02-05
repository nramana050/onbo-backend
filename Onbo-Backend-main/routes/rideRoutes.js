const express = require('express');
const rideController = require('../controllers/rideController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/rides', authenticateToken(['driver']), rideController.createRide);
router.put('/rides/:id', authenticateToken(['driver']), rideController.endRide);
router.get('/rides', authenticateToken(['branchAdmin','instituteAdmin']), rideController.getAllRides);
router.get('/rides/:id', authenticateToken(['branchAdmin','instituteAdmin']), rideController.getRideById);


module.exports = router;
