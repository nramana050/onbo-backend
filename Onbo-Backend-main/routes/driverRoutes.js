const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/driver', authenticateToken(['branchAdmin']), driverController.getAllDrivers);
router.get('/driver/:id', authenticateToken(['branchAdmin']), driverController.getDriverById);

// router.post('/driverResponse', authenticateToken(['driver']), driverController.respondToDriverRequest);
// Todo: get by id
// Todo: update by id
// Todo: delete more than 1
module.exports = router;
