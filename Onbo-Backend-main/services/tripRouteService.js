const { populate } = require('../models/notification');
const TripRoute = require('../models/tripRoute');

const createTripRoute = async (tripRouteData) => {
  try {
    const newTripRoute = await TripRoute.create(tripRouteData);
    return {
      status: true,
      message: 'Trip route created successfully',
      data: newTripRoute
    };
  } catch (error) {
    return { status: 500, message: 'Failed to create trip route' }
  }
};

const getAllTripRoutes = async ({ page = 1, pageSize = null, filter = '' }) => {
  try {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = pageSize !== null ? parseInt(pageSize, 10) : null;

    const query = {};

    if (filter) {
      query.tripRouteName = { $regex: new RegExp(filter, 'i') };
    }

    const totalCount = await TripRoute.countDocuments(query);
    const tripRoutes = await TripRoute.find(query)
      .skip((pageNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber);

    const pagination = {
      page: pageNumber,
      pageSize: pageSizeNumber,
      totalRecords: totalCount,
      totalPages: pageSizeNumber !== null ? Math.ceil(totalCount / pageSizeNumber) : 1,
    };

    return {
      status: true,
      message: 'Successfully retrieve trip routes with pagination and filter',
      data: {
        tripRoutes,
        pagination,
      },
    };
  } catch (error) {
    return { status: false, message: 'Failed to retrieve trip routes' };
  }
};




const getTripRouteById = async (tripRouteId) => {
  try {
    const tripRoute = await TripRoute.findById(tripRouteId)
    .populate('stopsIds')
    if (!tripRoute) {
      return { status: false, message: 'Trip route not found' };
    }
    return {
      status: true,
      message: 'Successfully retrieved trip route by ID',
      data: tripRoute,
    };
  } catch (error) {
    return { status: false, message: 'Failed to retrieve trip route by ID' };
  }
};

const updateTripRoute = async (id, tripRouteData) => {
  try {
    const updatedTripRoute = await TripRoute.findByIdAndUpdate(id, tripRouteData, { new: true });
    return updatedTripRoute;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteTripRoute = async (id) => {
  try {
    await TripRoute.findByIdAndDelete(id);
    return { message: 'Trip route deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createTripRoute,
  getAllTripRoutes,
  getTripRouteById,
  updateTripRoute,
  deleteTripRoute
};
