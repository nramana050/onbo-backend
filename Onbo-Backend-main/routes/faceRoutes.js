const express = require('express');
const faceController = require('../controllers/faceController');
const router = express.Router();

router.post('/faces', faceController.registerFace);
router.get('/faces/:userId', faceController.getFacesById);
router.get('/faces', faceController.getAllFaces);

module.exports = router;
