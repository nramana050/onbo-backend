const Stops = require('../models/stops');
const TripRoute = require('../models/tripRoute');

const createStop = async (tripRouteId, stopsData) => {
    try {
        const existingRoute = await TripRoute.findById(tripRouteId);
        if (!existingRoute) {
            return {
                status: false,
                message: 'Invalid tripRouteId',
            };
        }

        const stopsPromises = stopsData.map(async (stop) => {
            const newStop = await Stops.create({ ...stop, tripRouteId });
            return newStop;
        });

        const createdStops = await Promise.all(stopsPromises);

        existingRoute.stopsIds = [...existingRoute.stopsIds, ...createdStops];
        await existingRoute.save();

        return {
            status: true,
            message: 'Stops created successfully',
            data: createdStops,
        };
    } catch (error) {
        return { status: false, message: 'Failed to create stops', };
    }
};

const getAllStops = async ({ page = 1, pageSize = null, filter = '' }) => {
    try {
      const pageNumber = parseInt(page, 10);
      const pageSizeNumber = pageSize !== null ? parseInt(pageSize, 10) : null;
  
      const query = {};
  
      if (filter) {
        query.stopName = { $regex: new RegExp(filter, 'i') };
      }
  
      const stopsCount = await Stops.countDocuments(query);
      const stops = await Stops.find(query)
        .skip((pageNumber - 1) * pageSizeNumber)
        .limit(pageSizeNumber)
        .populate('tripRouteId');
  
      const pagination = {
        page: pageNumber,
        pageSize: pageSizeNumber,
        totalRecords: stopsCount,
        totalPages: pageSizeNumber !== null ? Math.ceil(stopsCount / pageSizeNumber) : 1,
      };
  
      return {
        status: true,
        message: 'Stops retrieved successfully',
        data: {
          stops,
          pagination,
        },
      };
    } catch (error) {
      return { status: false, message: 'Failed to retrieve stops details' };
    }
  };

const getStopById = async (id) => {
    try {
        const stop = await Stops.findById(id)
        .populate('tripRouteId')
        .populate({
            path: 'tripRouteId',
            populate: { path: 'stopsIds' },
          });
        return {
            status: true,
            message: 'stop retrieved successfully',
            data: stop,
        };
    } catch (error) {
        return { status: false, message: 'Failed to retrieved stops details', };
    }
};

const updateStop = async (id, stopData) => {
    try {
        const updatedStop = await Stops.findByIdAndUpdate(id, stopData, { new: true });
        return updatedStop;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteStop = async (id) => {
    try {
        await Stops.findByIdAndDelete(id);
        return { message: 'Stop deleted successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createStop,
    getAllStops,
    getStopById,
    updateStop,
    deleteStop
};

