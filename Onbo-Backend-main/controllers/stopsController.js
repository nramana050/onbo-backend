const stopService = require('../services/stopsService');

const createStop = async (req, res) => {
    try {
      const { tripRouteId, stopsData } = req.body;
      const result = await stopService.createStop(tripRouteId, stopsData);
      if (result.status) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);  
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
};

const stopsService = require('../services/stopsService');

const getAllStops = async (req, res) => {
  try {
    const { page, pageSize, filter } = req.query;
    const params = { page, pageSize, filter };

    const stopsData = await stopsService.getAllStops(params);
    return res.json(stopsData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const getStopById = async (req, res) => {
  try {
    const id = req.params.id;
    const stop = await stopService.getStopById(id);
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found' });
    }
    return res.json(stop);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateStop = async (req, res) => {
  try {
    const id = req.params.id;
    const stopData = req.body;
    const updatedStop = await stopService.updateStop(id, stopData);
    return res.json(updatedStop);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteStop = async (req, res) => {
  try {
    const id = req.params.id;
    await stopService.deleteStop(id);
    return res.json({ message: 'Stop deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStop,
  getAllStops,
  getStopById,
  updateStop,
  deleteStop
};
