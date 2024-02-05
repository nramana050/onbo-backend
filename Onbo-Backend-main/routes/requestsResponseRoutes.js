const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestResponseController');
const { authenticateToken } = require('../middleware/authMiddleware');


router.post('/request',authenticateToken(['admin','student','driver','branchAdmin']), requestController.createRequest);
router.get('/request',authenticateToken(['admin','student','driver','branchAdmin','branchAdmin']), requestController.getAllRequests);
router.get('/request/:id',authenticateToken(['admin','student','driver','branchAdmin']), requestController.getRequestById);
router.put('/request-response',authenticateToken(['admin','student','driver','branchAdmin']), requestController.updateRequestStatus);

module.exports = router;
