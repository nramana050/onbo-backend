const Institute = require('../models/institute');
const instituteService = require('../services/instituteService');

const createInstitute = async (req, res) => {
  try {
    const { name } = req.body;
    const newInstitute = new Institute({ name });
    await newInstitute.save();
    res.status(201).json({ status: true, message: 'Institute created successfully', data: newInstitute });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

const getInstituteById = async (req, res) => {
  try {
    const { Id } = req.params;
    const result = await instituteService.getInstituteById(Id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Failed to perform the operation. Please try again later.' });
  }
};

const getAllInstitutes = async (req, res) => {
  try {
    const { page, pageSize,filter } = req.query;
    const result = await instituteService.getInstitutesWithPagination(page, pageSize,filter);
    
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

module.exports = { createInstitute,getInstituteById,getAllInstitutes };
