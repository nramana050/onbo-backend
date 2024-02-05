const Institute = require('../models/institute');
const Branch = require('../models/branch');

const createInstitute = async (name) => {
  try {
    const newInstitute = new Institute({ name });
    await newInstitute.save();
    return { status: true, message: 'Institute created successfully', data: newInstitute };
  } catch (error) {
    console.error(error);
    return { status: false, message: 'Internal server error' };
  }
};

const getInstituteById = async (Id) => {
  try {
    const institute = await Institute.findById(Id)
      .populate({
        path: 'branchIds',
        populate: {
          path: 'adminIds',
          populate: [
            { path: 'branchAdminProfile', model: 'BranchAdminProfile' },
          ],
        },
      });

    if (!institute) {
      return { status: false, message: 'Institute not found.' };
    }

    const branches = await Branch.find({ institute: Id });

    const result = {
      status: true,
      message: 'Institute details retrieved successfully',
      data: {
        institute,
        branches,
      },
    };

    return result;
  } catch (error) {
    console.error(error);
    return { status: false, message: 'Failed to retrieve institute details. Please try again later.' };
  }
};

const getInstitutesWithPagination = async (page = 1, pageSize = 10,filter = '') => {
  try {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    const filterObject = filter ? { name: { $regex: new RegExp(filter, 'i') } } : {};

    const startIndex = (pageNumber - 1) * pageSizeNumber;

    const result = await Institute.find(filterObject).skip(startIndex).limit(pageSizeNumber);

    const totalCount = await Institute.countDocuments(filterObject);

    return {
      status: true,
      data: {
        result,
        pagination: {
          page:pageNumber,
          pageSize:pageSizeNumber,
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


module.exports = { createInstitute,getInstituteById, getInstitutesWithPagination };
