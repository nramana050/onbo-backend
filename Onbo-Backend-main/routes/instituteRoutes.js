const express = require('express');
const instituteController = require('../controllers/instituteController');
const router = express.Router();

router.post('/institutes', instituteController.createInstitute);
router.get('/institutes', instituteController.getAllInstitutes);
router.get('/institutes/:Id', instituteController.getInstituteById);

module.exports = router;
