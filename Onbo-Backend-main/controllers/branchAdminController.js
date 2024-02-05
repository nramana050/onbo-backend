const User = require('../models/user');
const BranchAdminProfile = require('../models/branchAdminProfile');

const getAllBranchAdmins = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ status: false, message: 'Permission denied' });
    }

    let instituteId;
    
    if (req.user.role === 'instituteAdmin' && req.user.instituteAdminProfile) {
      instituteId = req.user.instituteAdminProfile.instituteId;
    } else if (req.user.role === 'branchAdmin' && req.user.instituteAdminProfile) {
      instituteId = req.user.instituteAdminProfile.instituteId;
    } else {
      return res.status(403).json({ status: false, message: 'Permission denied' });
    }

    const { page, pageSize, filter } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = pageSize !== null ? parseInt(pageSize, 10) : null;

    const BranchAdminProfiles = await BranchAdminProfile.find({
      instituteId: instituteId,
    });

    const BranchAdminProfileIds = BranchAdminProfiles.map(profile => profile._id);

    const filterObject = {
      role: 'branchAdmin',
      'branchAdminProfile': { $in: BranchAdminProfileIds },
    };

    if (filter) {
      const regexFilter = { $regex: new RegExp(filter, 'i') };
      filterObject.$or = [{ mobileNumber: regexFilter }];
    }

    const totalCount = await User.countDocuments(filterObject);

    const startIndex = (pageNumber - 1) * pageSizeNumber;

    const students = await User.find(filterObject)
      .skip(startIndex)
      .limit(pageSizeNumber)
      .populate('branchAdminProfile');

    const pagination = {
      page: pageNumber,
      pageSize: pageSizeNumber,
      totalRecords: totalCount,
      totalPages: pageSizeNumber !== null ? Math.ceil(totalCount / pageSizeNumber) : 1,
    };

    return res.status(200).json({
      status: true,
      message: 'Branch Admin data retrieved successfully',
      data: {
        students,
        pagination,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
};

// const getBranchAdminById = async (req, res) => {
//     try {
//       if (!req.user) {
//         return res.status(403).json({ status: false, message: 'Permission denied' });
//       }
  
//       let instituteId;
      
//       if (req.user.role === 'instituteAdmin' && req.user.instituteAdminProfile) {
//         instituteId = req.user.instituteAdminProfile.instituteId;
//       } else if (req.user.role === 'branchAdmin' && req.user.branchAdminProfile) {
//         instituteId = req.user.branchAdminProfile.instituteId;
//       } else {
//         return res.status(403).json({ status: false, message: 'Permission denied' });
//       }
  
//       const branchAdminId = req.params.branchAdminId; 
  
//       const branchAdmin = await User.findOne({
//         _id: branchAdminId,
//         role: 'branchAdmin',
//         'branchAdminProfile.instituteId': instituteId,
//       }).populate('branchAdminProfile');
  
//       if (!branchAdmin) {
//         return res.status(404).json({ status: false, message: 'Branch Admin not found' });
//       }
  
//       return res.status(200).json({
//         status: true,
//         message: 'Branch Admin data retrieved successfully',
//         data: {
//           branchAdmin,
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ status: false, message: 'Something went wrong' });
//     }
//   };

module.exports = {
  getAllBranchAdmins,
//   getBranchAdminById,
};
