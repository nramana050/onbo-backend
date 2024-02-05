const DriverProfile = require('../models/driverProfile');
const User = require('../models/user');
const Stops = require('../models/stops');

const getAllDrivers = async (req, res) => {
  try {
    const { page, pageSize, filter } = req.query;

    const pageNumber = parseInt(page,10);
    const pageSizeNumber = pageSize !== null ? parseInt(pageSize, 10): null;

    const instituteId = req.user.branchAdminProfile.instituteId;
    const branchId = req.user.branchAdminProfile.branchId;

    const driverProfiles = await DriverProfile.find({
      instituteId: instituteId,
      branchId: branchId,
    });

    const driverProfileIds = driverProfiles.map(profile => profile._id);

    const filterObject = {
      role: 'driver',
      'driverProfile': { $in: driverProfileIds },
    };

    if (filter) {
      const regexFilter = { $regex: new RegExp(filter, 'i') };
      filterObject.$or = [{ mobileNumber: regexFilter }];
    }

    const totalCount = await User.countDocuments(filterObject);

    const startIndex = (pageNumber - 1) * pageSizeNumber;

    const drivers = await User.find(filterObject)
      .skip(startIndex)
      .limit(pageSizeNumber)
      .populate('driverProfile');

      const pagination = {
        page: pageNumber,
        pageSize: pageSizeNumber,
        totalRecords: totalCount,
        totalPages: pageSizeNumber !== null ? Math.ceil(totalCount / pageSizeNumber) : 1,
      };

    return res.status(200).json({
      status: true,
      message: 'Driver retrieved Successfully',
      data: {
        drivers,
        pagination,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      status: false, 
      message: 'Something went wrong' 
    });
  }
};

const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
    .populate({
      path: 'driverProfile',
    });

    if (!user) {
      return res.status(404).json({ status: false, message: 'Driver not found' });
    }
    if (req.user.role === 'driver' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ status: false, message: 'You do not have permission to view this Driver' });
    }

    if (req.user.branchAdminProfile) {
      const instituteId = req.user.branchAdminProfile.instituteId;
      const branchId = req.user.branchAdminProfile.branchId;

      if (
        user.driverProfile &&
        user.driverProfile.instituteId.toString() === instituteId.toString() &&
        user.driverProfile.branchId.toString() === branchId.toString()
      ) {
        return res.status(200).json({
          status: true,
          message: 'Driver retrieved successfully',
          data: user,
        });
      } else {
        return res.status(403).json({ status: false, message: 'You do not have permission to view this Driver' });
      }
    } else {
      return res.status(200).json({ status: true, message: 'Driver retrieved successfully', data: user });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
};

// const updateDriverById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { stopId, ...driverData } = req.body;
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ status: false, message: 'User not found' });
//     }

//     if (
//       (req.user.role === 'driver' && req.user._id.toString() !== user._id.toString()) &&
//       (!req.user.branchAdminProfile || req.user.branchAdminProfile.branchId.toString() !== user.studentProfile.branchId.toString())
//     ) {
//       return res.status(403).json({ status: false, message: 'You do not have permission to update this student' });
//     }

//     const driverProfile = await DriverProfile.findOne({ _id: user.driverProfile });

//     if (!driverProfile) {
//       return res.status(404).json({ status: false, message: 'Driver profile not found' });
//     }

//     if (stopId) {
//       const stop = await Stops.findById(stopId);
//       if (!stop) {
//         return res.status(404).json({ status: false, message: 'Stop not found' });
//       }

//       driverProfile.stopsId = stopId;
//     }

//     Object.assign(driverProfile, driverData);

//     await driverProfile.save();
//     return res.status(200).json({
//       status: true,
//       message: 'Driver Profile updated successfully'
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: false, message: 'Something went wrong' });
//   }
// };

// const respondToDriverRequest = async (req, res) => {
//   try {
//     const { requestId, status } = req.body;

//     const message = await driverService.respondToDriverRequest(requestId, status);

//     res.json({ message });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

module.exports = {
  getAllDrivers,
  getDriverById,
  // updateDriverById,
  // respondToDriverRequest,
};
