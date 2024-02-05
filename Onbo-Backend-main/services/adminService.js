// services/adminService.js
const Bus = require('../models/bus');
const User = require('../models/user');
const Request = require('../models/requestResponse');

const assignDriverAndStudents = async (busId, { driverId, studentIds = [] }, adminToken) => {
  try {
    const admin = await User.findById(adminToken.userId);

    if (!admin || admin.role !== 'admin') {
      return { status: false, message: 'Invalid admin ID' };
    }

    const bus = await Bus.findById(busId);

    if (!bus) {
      return { status: false, message: 'Invalid bus ID' };
    }

    // Remove existing requests for the driver
    if (driverId) {
      await Request.deleteMany({
        requesterType: 'Admin',
        requester: admin._id,
        accepterType: 'Driver',
        accepter: driverId,
        bus: bus._id,
      });
    }

    // Remove existing requests for students
    if (studentIds.length > 0) {
      await Request.deleteMany({
        requesterType: 'Admin',
        requester: admin._id,
        accepterType: 'Student',
        accepter: { $in: studentIds },
        bus: bus._id,
      });
    }

    // Create request for the driver if driverId is provided
    if (driverId) {
      const driver = await User.findById(driverId);
      const driverRequest = {
        requesterType: 'Admin',
        requester: admin._id,
        accepterType: 'Driver',
        accepter: driver._id,
        bus: bus._id,
        status: 'Pending',
      };

      const createdDriverRequest = await Request.create(driverRequest);
      bus.request = createdDriverRequest._id;

      // Create requests for students if studentIds are provided
      if (studentIds.length > 0) {
        const studentRequests = studentIds.map((studentId) => ({
          requesterType: 'Admin',
          requester: admin._id,
          accepterType: 'Student',
          accepter: studentId,
          bus: bus._id,
          status: 'Pending',
        }));

        const createdStudentRequests = await Request.insertMany(studentRequests);
        bus.requests = createdStudentRequests.map((req) => req._id);

        return {
          status: true,
          message: 'Request sent to driver and students successfully',
          driverRequestId: createdDriverRequest._id,
          studentRequestIds: createdStudentRequests.map((req) => req._id),
        };
      } else {
        return {
          status: true,
          message: 'Request sent to driver successfully',
          requestId: createdDriverRequest._id,
        };
      }
    } else if (studentIds.length > 0) {
      // Create requests for students if only studentIds are provided
      const studentRequests = studentIds.map((studentId) => ({
        requesterType: 'Admin',
        requester: admin._id,
        accepterType: 'Student',
        accepter: studentId,
        bus: bus._id,
        status: 'Pending',
      }));

      const createdStudentRequests = await Request.insertMany(studentRequests);
      bus.requests = createdStudentRequests.map((req) => req._id);

      return {
        status: true,
        message: 'Request sent to students successfully',
        requestId: createdStudentRequests.map((req) => req._id)[0],
      };
    } else {
      // No valid parameters provided
      return { status: false, message: 'Invalid request parameters' };
    }
  } catch (error) {
    console.error(error.message);
    return { status: false, message: 'Internal Server Error' };
  }
};

const removeDriverOrStudentFromBus = async (busId, { driverId, studentIds }, adminToken) => {
  try {
    const admin = await User.findById(adminToken.userId);

    if (!admin || admin.role !== 'admin') {
      return { status: false, message: 'Invalid admin ID' };
    }

    const bus = await Bus.findById(busId);

    if (!bus) {
      return { status: false, message: 'Invalid bus ID' };
    }

    let result;

    if (driverId && studentIds && studentIds.length > 0) {
      // Remove both driver and students
      bus.driverId = null;
      for (const studentId of studentIds) {
        const studentIndex = bus.studentIds.indexOf(studentId);
        if (studentIndex !== -1) {
          bus.studentIds.splice(studentIndex, 1);
        }
      }
      await bus.save();
      result = { status: true, message: 'Driver and students removed from the bus successfully' };
    } else if (driverId) {
      // Remove only the driver
      bus.driverId = null;
      await bus.save();
      result = { status: true, message: 'Driver removed from the bus successfully' };
    } else if (studentIds && studentIds.length > 0) {
      // Remove only the students
      for (const studentId of studentIds) {
        const studentIndex = bus.studentIds.indexOf(studentId);
        if (studentIndex !== -1) {
          bus.studentIds.splice(studentIndex, 1);
        }
      }
      await bus.save();
      result = { status: true, message: 'Students removed from the bus successfully' };
    } else {
      return { status: false, message: 'No valid parameters provided for removal' };
    }

    return result;
  } catch (error) {
    console.error(error.message);
    return { status: false, message: 'Internal Server Error' };
  }
};



module.exports = {
  assignDriverAndStudents,
  removeDriverOrStudentFromBus
};
