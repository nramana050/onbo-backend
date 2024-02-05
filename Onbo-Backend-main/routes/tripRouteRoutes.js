const express = require('express');
const router = express.Router();
const tripRouteController = require('../controllers/tripRouteController');
const { authenticateToken } = require('../middleware/authMiddleware');


// router.get('/route', authenticateToken(['admin', 'instituteAdminProfile', 'branchAdminProfile', 'driver']), tripRouteController.getAllTripRouteNames);
router.post('/trip-route', authenticateToken([ 'instituteAdmin', 'branchAdmin', 'driver', 'student']), tripRouteController.createTripRoute);
router.get('/trip-route', authenticateToken([ 'instituteAdmin', 'branchAdmin', 'driver', 'student']), tripRouteController.getAllTripRoutes);
router.get('/trip-route/:id', authenticateToken([ 'instituteAdmin', 'branchAdmin', 'driver', 'student']), tripRouteController.getTripRouteById);
router.put('/trip-route/:id', authenticateToken([ 'instituteAdmin', 'branchAdmin', 'driver', 'student']), tripRouteController.updateTripRoute);
router.delete('/trip-route/:id', authenticateToken([ 'instituteAdmin', 'branchAdmin', 'driver', 'student']), tripRouteController.deleteTripRoute);

module.exports = router;