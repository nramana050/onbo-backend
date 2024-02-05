const Attendance = require('../models/attendance');
const Ride = require('../models/ride')

const createAttendance = async (req, res) => {

  const { rideId, studentId, onboardLocation } = req.body;

  const {_id: driverId } = req.user;

  try {
    const activeRide = await Ride.findOne({
      driverId,
      rideEnd: 'Not Ended', 
      isActive: true 
    });

    if (!activeRide) {
      return res.status(400).json({ status: false, message: 'Driver is not currently on an active ride' });
    }

    // // Validate if the provided studentId matches the logged-in driver's studentIds
    // if (activeRide.studentIds !== studentId) {
    //   return res.status(400).json({ status: false, message: 'Invalid studentId for the current ride' });
    // }

    const attendanceData = {
      rideId: activeRide._id,
      studentId,
      branchId: activeRide.branchId,
      instituteId: activeRide.instituteId,
      onboardDate: new Date(),
      onboardLocation: {
        latitude: onboardLocation.latitude,
        longitude: onboardLocation.longitude,
      },
      offboardDate: null,
    };

    const newAttendance = await Attendance.create(attendanceData);

    res.status(201).json({ status: true, message: 'Attendance created successfully', data: newAttendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};


const updateAttendance = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.offboardLocation) {
      updateData.offboardLocation = {
        latitude: updateData.offboardLocation.latitude,
        longitude: updateData.offboardLocation.longitude,
      };

    }

    updateData.offboardDate = new Date();
  
    try {
      const updatedAttendance = await Attendance.findByIdAndUpdate(id, updateData, { new: true });
      if (updatedAttendance) {
        res.status(200).json({ status: true, message: 'Attendance updated successfully', data: updatedAttendance });
      } else {
        res.status(404).json({ status: false, message: 'Attendance not found' });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
  };

const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find({});
    res.status(200).json({ status: true, data: attendances });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

const getAttendanceById = async (req, res) => {
  const { id } = req.params;
  try {
    const attendance = await Attendance.findById(id);
    if (attendance) {
      res.status(200).json({ status: true, data: attendance });
    } else {
      res.status(404).json({ status: false, message: 'Attendance not found' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};


const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(id);
    if (deletedAttendance) {
      res.status(200).json({ status: true, data: deletedAttendance });
    } else {
      res.status(404).json({ status: false, message: 'Attendance not found' });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};
