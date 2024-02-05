const busService = require('../services/busService');
const createBus = async (req, res) => {
  try {
    const { busNo,tripRouteId } = req.body;
    const result = await busService.createBus(busNo,tripRouteId,req.user);

    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Error creating bus' });
  }
};

const getAllBuses = async (req, res) => {
  try {
    const result = await busService.getAllBuses(req, res);
    return result;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Error retrieving buses' });
  }
};


const getBusesById = async (req, res) => {
  try {
    const { page, pageSize, filter } = req.query;

    if (req.params.id) {
      const result = await busService.getBusById(req.params.id);
      return res.json(result);
    }

    const result = await busService.getAllBuses({ page, pageSize, filter });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

const updateBusTripRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { tripRouteId } = req.body;

    const result = await busService.updateBusTripRoute(id, tripRouteId);

    if (result.status) {
      return res.json(result);
    } else {
      return res.status(400).json(result); // Use appropriate status code
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

module.exports = {
  createBus,
  getAllBuses,
  getBusesById,
  updateBusTripRoute,
};
