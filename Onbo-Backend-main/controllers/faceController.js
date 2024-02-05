const faceService = require('../services/faceService');

const registerFace = async (req, res) => {
  try {
    const { userId, faceProfile } = req.body;

    // Validate input
    if (!userId || !faceProfile) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const result = await faceService.registerFace({ userId, faceProfile });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getFacesById = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you're passing the user ID as a route parameter

    const result = await faceService.getFacesById(userId);

    if (result.status) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result); // Adjust the status code as needed (e.g., 404 for "User not found")
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllFaces = async (req, res) => {
  try {
    const result = await faceService.getAllFaces();

    if (result.status) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = {
  registerFace,
  getFacesById,
  getAllFaces,
};
