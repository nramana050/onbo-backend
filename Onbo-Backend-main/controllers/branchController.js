const branchService = require('../services/branchService');

const createBranch = async (req, res) => {
  try {
    const { name, instituteId,adminIds} = req.body;
    const result = await branchService.createBranch({ name, instituteId,adminIds });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllBranches = async (req, res) => {
  try {
    const { page, pageSize,filter} = req.query;
    const result = await branchService.getBranchesWithPagination(page, pageSize,filter);
    
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

module.exports = {
  createBranch,
  getAllBranches,
};
