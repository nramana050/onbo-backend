const Branch = require('../models/branch');
const Institute = require('../models/institute'); 
const User = require('../models/user'); 


const createBranch = async ({ name, instituteId, adminIds }) => {
  try {
    const instituteExists = await Institute.exists({ _id: instituteId });
    if (!instituteExists) {
      return { status: false, message: 'Institute not found' };
    }

    if (adminIds && adminIds.length > 0) {
      const adminExistsPromises = adminIds.map(adminId => User.exists({ _id: adminId }));
      const adminExistsResults = await Promise.all(adminExistsPromises);
      if (adminExistsResults.includes(false)) {
        return { status: false, message: 'One or more admins not found' };
      }
    }

    const existingBranch = await Branch.findOne({ name, instituteId });
    if (existingBranch) {
      return { status: false, message: 'Branch with the same name already exists in the institute' };
    }

    const newBranch = new Branch({ name, instituteId, adminIds });
    await newBranch.save();

    const institute = await Institute.findById(instituteId);
    institute.branchIds.push(newBranch._id);
    await institute.save();

    const branches = await Branch.find({ instituteId });

    return { status: true, message: 'Branch created successfully', data: branches };
  } catch (error) {
    console.error(error);
    return { status: false, message: 'Internal server error' };
  }
};


const getBranchesWithPagination = async (page = 1, pageSize = 10, filter = '') => {
  try {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    const filterObject = filter ? { name: { $regex: new RegExp(filter, 'i') } } : {};

    const startIndex = (pageNumber - 1) * pageSizeNumber;

    const result = await Branch.find(filterObject).skip(startIndex).limit(pageSizeNumber);

    const totalCount = await Branch.countDocuments(filterObject);

    return {
      status: true,
      data: {
        result,
        pagination: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          totalRecords: totalCount,
          totalPages: Math.ceil(totalCount / pageSizeNumber),
        },
      },
    };
  } catch (error) {
    console.error(error);
    return { status: false, message: 'Internal server error' };
  }
};


module.exports = { createBranch, getBranchesWithPagination };
