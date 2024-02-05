const express = require('express');
const branchController = require('../controllers/branchController');
const router = express.Router();

router.post('/branch', branchController.createBranch);
router.get('/branch', branchController.getAllBranches);
// Todo: get by id
// Todo: update by id
// Todo: delete more than 1

module.exports = router;
