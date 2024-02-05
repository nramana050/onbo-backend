const Bus = require('../models/bus');
const TripRoute = require('../models/tripRoute');

const createBus = async (busNo,tripRouteId, user) => {
  try {
    const existingBus = await Bus.findOne({ busNo });

    if (existingBus) {
      return { status: false, message: 'Bus number already in use' };
    }

    const existingTripRoute = await TripRoute.findById(tripRouteId);
    if (!existingTripRoute) {
      return { status: false, message: 'Trip route not found' };
    }

    const newBus = new Bus({
      busNo,
      // userId: user._id,
      instituteId: user.branchAdminProfile.instituteId._id,
      branchId: user.branchAdminProfile.branchId._id,
      driverId: null,
      studentIds: [],
      tripRouteId,
    });

    const savedBus = await newBus.save();

    return { status: true, message: 'Bus created successfully', data: savedBus };
  } catch (error) {
    console.error(error);
    return { status: false, message: 'Error creating bus' };
  }
};


const getAllBuses = async (req, res) => {
  try {
    const { page = 1, pageSize = null, filter = '' } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = pageSize !== null ? parseInt(pageSize, 10) : null;

    const filterObject = filter ? { busNo: { $regex: new RegExp(filter, 'i') } } : {};

    const startIndex = (pageNumber - 1) * (pageSizeNumber !== null ? pageSizeNumber : 10);

    const allBuses = await Bus.find(filterObject)
      .populate('instituteId')
      .populate('branchId')
      .populate({
        path: 'driverId',
        populate: 'driverProfile',
      })
      .populate('tripRouteId')
      .skip(startIndex)
      .limit(pageSizeNumber);

    const totalCount = await Bus.countDocuments(filterObject);

    return res.json({
      status: true,
      message: 'Buses retrieved successfully',
      data: allBuses,
        pagination: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          totalRecords: totalCount,
          totalPages: Math.ceil(totalCount / (pageSizeNumber !== null ? pageSizeNumber : 10)),
        },
      },
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Error retrieving buses' });
  }
};

const getBusById = async (busId) => {
  try {
    const bus = await Bus.findById(busId)
    .populate('tripRouteId')
    .populate('instituteId')
    .populate('branchId')
    .populate({
      path: 'driverId',
      populate: 'driverProfile',
    })
    if (!bus) {
      return { status: false, message: 'Bus not found' };
    }

    return { status: true, message: 'Bus retrieved successfully', data: { bus } };
  } catch (error) {
    console.error(error);
    return { status: false, message: 'Error retrieving bus by ID' };
  }
};

const updateBusTripRoute = async (busId, tripRouteId) => {
  try {
    // Check if the specified tripRouteId exists
    const existingTripRoute = await TripRoute.findById(tripRouteId);
    if (!existingTripRoute) {
      return { status: false, message: 'Trip route not found' };
    }

    // Update the bus with the new tripRouteId
    const updatedBus = await Bus.findByIdAndUpdate(
      busId,
      { $set: { tripRouteId } },
      { new: true }
    );

    if (!updatedBus) {
      return { status: false, message: 'Bus not found' };
    }

    return { status: true, message: 'Bus trip route updated successfully', data: updatedBus };
  } catch (error) {
    console.error(error);
    return { status: false, message: 'Error updating bus trip route' };
  }
};

module.exports = { 
  createBus,
  getAllBuses,
  getBusById,
  updateBusTripRoute,
 };
