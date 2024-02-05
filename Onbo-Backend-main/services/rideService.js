const Bus = require('../models/bus');

const getBusIdAndTripRouteIdForDriver = async (driverId) => {
  try {
    const bus = await Bus.findOne({ driverId: driverId });

    return bus
      ? { busId: bus._id, tripRouteId: bus.tripRouteId, driverId: bus.driverId }
      : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  getBusIdAndTripRouteIdForDriver,
};