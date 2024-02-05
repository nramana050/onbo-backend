const adminService = require('../services/adminService');

const assignDriverAndStudents = async (req, res) => {
  try {
    const { busId } = req.body; 
    const { driverId, studentIds} = req.body;
    
    if (!req.user || !req.user._id) {
      console.error('User information not found in the request');
      return res.status(403).json({ error: 'Forbidden' });
    }

    const adminUserId = req.user._id;

  let result;

  if (driverId && studentIds && studentIds.length > 0) {
    result = await adminService.assignDriverAndStudents(busId, { driverId, studentIds }, { userId: adminUserId });
  } else if (driverId) {
    result = await adminService.assignDriverAndStudents(busId, { driverId }, { userId: adminUserId });
  } else if (studentIds && studentIds.length > 0) {
    result = await adminService.assignDriverAndStudents(busId, { studentIds }, { userId: adminUserId });
  } else {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  return res.status(200).json({ message: result });
} catch (error) {
  console.error(error.message);
  return res.status(500).json({ error: 'Internal Server Error' });
}
};

const removeDriverOrStudentFromBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const { driverId, studentIds } = req.body;

    if (!req.user || !req.user._id) {
      console.error('User information not found in the request');
      return res.status(403).json({ error: 'Forbidden' });
    }

    const adminUserId = req.user._id;

    let result;

    if (driverId && studentIds && studentIds.length > 0) {
      result = await adminService.removeDriverOrStudentFromBus(busId, { driverId, studentIds }, { userId: adminUserId });
    } else if (driverId) {
      result = await adminService.removeDriverOrStudentFromBus(busId, { driverId }, { userId: adminUserId });
    } else if (studentIds && studentIds.length > 0) {
      result = await adminService.removeDriverOrStudentFromBus(busId, { studentIds }, { userId: adminUserId });
    } else {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    if (result.status) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
assignDriverAndStudents,
removeDriverOrStudentFromBus
};
