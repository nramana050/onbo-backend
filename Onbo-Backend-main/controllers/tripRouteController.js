const tripRouteService = require('../services/tripRouteService');



const createTripRoute = async (req, res) => {
  try {
    const tripRouteData = req.body;
    const newTripRoute = await tripRouteService.createTripRoute(tripRouteData);
    return res.status(201).json(newTripRoute);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllTripRoutes = async (req, res) => {
  try {
    const { page, pageSize, filter } = req.query;
    const params = { page, pageSize, filter };

    const tripRoutes = await tripRouteService.getAllTripRoutes(params);
    return res.json(tripRoutes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getTripRouteById = async (req, res) => {
  try {
    const tripRouteId = req.params.id;
    const tripRoute = await tripRouteService.getTripRouteById(tripRouteId);
    if (!tripRoute.status) {
      return res.status(404).json({ message: tripRoute.message });
    }
    return res.json(tripRoute);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateTripRoute = async (req, res) => {
  try {
    const id = req.params.id;
    const tripRouteData = req.body;
    const updatedTripRoute = await tripRouteService.updateTripRoute(id, tripRouteData);
    return res.json(updatedTripRoute);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteTripRoute = async (req, res) => {
  try {
    const id = req.params.id;
    await tripRouteService.deleteTripRoute(id);
    return res.json({ message: 'Trip route deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTripRoute,
  getAllTripRoutes,
  getTripRouteById,
  updateTripRoute,
  deleteTripRoute
};

