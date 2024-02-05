const express = require('express');
const router = express.Router();
const stopsController = require('../controllers/stopsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/stops', authenticateToken(['driver', 'branchAdmin']), stopsController.createStop);
router.get('/stops', authenticateToken(['driver', 'branchAdmin']), stopsController.getAllStops);
router.get('/stops/:id', authenticateToken(['driver', 'branchAdmin']), stopsController.getStopById);
router.put('/stops/:id', authenticateToken(['driver', 'branchAdmin']), stopsController.updateStop);
router.delete('/stops/:id', authenticateToken(['driver', 'branchAdmin']), stopsController.deleteStop);

module.exports = router;
