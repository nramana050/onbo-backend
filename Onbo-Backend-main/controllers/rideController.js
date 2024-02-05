const Ride = require('../models/ride');
const rideService = require('../services/rideService');


const createRide = async (req, res) => {
  try {
    const { _id: driverId } = req.user;

    const existingRide = await Ride.findOne({
      driverId: driverId,
      rideStart: 'Started',
      rideEnd: 'Not Ended'
    });

    if (existingRide) {
      return res.status(400).json({ status: false, message: 'Driver has already started a ride.' });
    }
    const busData = await rideService.getBusIdAndTripRouteIdForDriver(driverId);

    if (!busData || !busData.busId || !busData.tripRouteId || !busData.driverId) {
      return res.status(400).json({ status: false, message: 'Driver is not assigned to any bus.' });
    }

    if (busData.driverId.toString() !== driverId.toString()) {
      return res.status(403).json({ status: false, message: 'Unauthorized: Driver ID mismatch.' });
    }

    const rideData = {
      driverId,
      busId: busData.busId.toString(),
      instituteId: req.user.driverProfile.instituteId._id,
      branchId: req.user.driverProfile.branchId._id,
      tripRouteId: busData.tripRouteId.toString(),
      startCoordinates: {
        latitude: req.body.startCoordinates.latitude,
        longitude: req.body.startCoordinates.longitude,
      },
      rideType: req.body.rideType,
      startDate: new Date(),
      endDate: null,
      rideStart: 'Started',
      rideEnd: 'Not Ended',
    };

    const ride = await Ride.create(rideData);

    res.status(201).json({ status: true, message: 'Ride created successfully', data: ride });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};



const endRide = async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findById(id);

    if (!ride) {
      return res.status(404).json({ status: false, message: 'Ride not found.' });
    }

    if (ride.rideEnd === 'Ended') {
      return res.status(400).json({ status: false, message: 'Driver has already ended a ride' });
    }

    // const existingRide = await Ride.findOne({
    //   driverId: ride.driverId,
    //   rideEnd: 'Ended',

    // });

    // if (existingRide) {
    //   return res.status(400).json({ status: false, message: 'Driver has already ended a ride.' });
    // }

    const updatedRide = await Ride.findByIdAndUpdate(
      id,
      {
        rideEnd: 'Ended',
        endDate: new Date(),
        endCoordinates: {
          latitude: req.body.endCoordinates.latitude,
        longitude: req.body.endCoordinates.longitude,
        },
        isActive:false,
      },
      { new: true }
    );

    res.status(200).json({ status: true, message: 'Ride ended successfully', data: updatedRide });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};


const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate('busId')
      .populate({
        path: 'driverId',
        populate: { path: 'driverProfile' },
      })
      .populate('instituteId')
      .populate('branchId')
      .populate('tripRouteId')
      .exec();

    res.status(200).json({ status: true, message: 'Rides retrieved successfully', data: rides });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Something went wrong' });
  }
};

const getRideById = async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findById(id)
      .populate({
        path: 'busId',
        populate: [
          { path: 'studentIds', populate: 'studentProfile' },
          // {path: 'userDevices'},
        ],
      })
      .populate({
        path: 'driverId',
        populate: { path: 'driverProfile' },
      })
      .populate('instituteId')
      .populate({
        path: 'branchId',
        populate: { path: 'adminIds' },
      })
      .populate({
        path: 'tripRouteId',
        populate: { path: 'stopsIds' },
      })
      .exec();

    if (!ride) {
      return res.status(404).json({ status: false, message: 'Ride not found.' });
    }

    res.status(200).json({ status: true,  message: 'Ride retrieved successfully',data: ride });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  createRide,
  endRide,
  getAllRides,
  getRideById,
};
















