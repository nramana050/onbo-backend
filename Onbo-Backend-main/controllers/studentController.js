const User = require('../models/user');
const StudentProfile = require('../models/studentProfile');
const Stops = require('../models/stops');

const getAllStudents = async (req, res) => {
  try {
    const { page, pageSize, filter } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = pageSize !== null ? parseInt(pageSize, 10) : null;

    const instituteId = req.user.branchAdminProfile.instituteId;
    const branchId = req.user.branchAdminProfile.branchId;

    const studentProfiles = await StudentProfile.find({
      instituteId: instituteId,
      branchId: branchId,
    });

    const studentProfileIds = studentProfiles.map(profile => profile._id);

    const filterObject = {
      role: 'student',
      'studentProfile': { $in: studentProfileIds },
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
      .populate('studentProfile');
      
    const pagination = {
      page: pageNumber,
      pageSize: pageSizeNumber,
      totalRecords: totalCount,
      totalPages: pageSizeNumber !== null ? Math.ceil(totalCount / pageSizeNumber) : 1,
    };

    return res.status(200).json({
      status: true,
      message: 'Students retrieved successfully',
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

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate({
      path: 'studentProfile',
    });

    if (!user) {
      return res.status(404).json({ status: false, message: 'Student not found' });
    }

    if (req.user.role === 'student' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ status: false, message: 'You do not have permission to view this student' });
    }

    if (req.user.branchAdminProfile) {
      const instituteId = req.user.branchAdminProfile.instituteId;
      const branchId = req.user.branchAdminProfile.branchId;

      if (
        user.studentProfile &&
        user.studentProfile.instituteId.toString() === instituteId.toString() &&
        user.studentProfile.branchId.toString() === branchId.toString()
      ) {
        return res.status(200).json({
          status: true,
          message: 'Student retrieved successfully',
          data: user,
        });
      } else {
        return res.status(403).json({ status: false, message: 'You do not have permission to view this student' });
      }
    } else {
      return res.status(200).json({ status: true, message: 'Student retrieved successfully', data: user });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
};

const updateStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { stopId, ...studentData } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    const isStudentRequest = req.user.role === 'student' && req.user._id.toString() !== user._id.toString();
    const isAdminRequest =
    req.user.branchAdminProfile &&
    (req.user.branchAdminProfile.branchId.toString() !== user.studentProfile.branchId.toString() ||
      req.user.branchAdminProfile.instituteId.toString() !== user.studentProfile.instituteId.toString());

    if (isStudentRequest || isAdminRequest) {
    return res
      .status(403)
      .json({ status: false, message: 'You do not have permission to update this student' });
    }

    const studentProfile = await StudentProfile.findOne({ _id: user.studentProfile });

    if (!studentProfile) {
      return res.status(404).json({ status: false, message: 'Student profile not found' });
    }

    if (stopId) {
      const stop = await Stops.findById(stopId);
      if (!stop) {
        return res.status(404).json({ status: false, message: 'Stop not found' });
      }

      studentProfile.stopsId = stopId;
    }

    Object.assign(studentProfile, studentData);
    await studentProfile.save();

    return res.status(200).json({
      status: true,
      message: 'Student Profile updated successfully'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudentById,
};
