const RequestResponse = require('../models/requestResponse');
const User = require('../models/user');
const Bus = require('../models/bus');
const DriverProfile = require('../models/driverProfile');
const StudentProfile = require('../models/studentProfile');

const requestController = {
    async createRequest(req, res) {
        try {
            const requestsData = req.body.requests;
            const createdRequests = [];
            const ignoredRequests = [];

            await Promise.all(requestsData.map(async (request) => {
                const modifiedRequest = {
                    requesterType: req.user.role,
                    requesterId: req.user._id,
                    ...request
                };

                if (req.user.instituteAdminProfile) {
                    modifiedRequest.branchId = req.user.instituteAdminProfile.branchId._id
                    modifiedRequest.instituteId = req.user.instituteAdminProfile.instituteId._id
                }
                if (req.user.branchAdminProfile) {
                    modifiedRequest.branchId = req.user.branchAdminProfile.branchId._id
                    modifiedRequest.instituteId = req.user.branchAdminProfile.instituteId._id
                }
                if (req.user.studentProfile) {
                    modifiedRequest.branchId = req.user.studentProfile.branchId._id
                    modifiedRequest.instituteId = req.user.studentProfile.instituteId._id
                }
                if (req.user.driverProfile) {
                    modifiedRequest.branchId = req.user.driverProfile.branchId._id
                    modifiedRequest.instituteId = req.user.driverProfile.instituteId._id
                }

                if (req.user.role == 'branchAdmin') {
                    if (request.accepterId) {
                        modifiedRequest.accepterId = request.accepterId;
                        const user = await User.findById(request.accepterId);
                        modifiedRequest.accepterType = user.role;
                    } else {
                        console.error('accepterId is missing. Ignoring this request.');
                        ignoredRequests.push(request);
                        return;
                    }
                }

                const createdRequest = await RequestResponse.create(modifiedRequest);
                createdRequests.push(createdRequest);
            }));

            return res.status(201).json({
                status: true,
                message: 'Requests created successfully',
                data: { createdRequests, ignoredRequests },
            });

        } catch (err) {
            res.status(500).json({ status: false, message: err.message });
        }
    },

    async getAllRequests(req, res) {
        try {
            const page = parseInt(req.query.page) || 1; // Current page (default: 1)
            const limit = parseInt(req.query.limit) || 10; // Number of records per page (default: 10)

            const options = {
                limit,
                skip: (page - 1) * limit,
            };

            const requests = await RequestResponse.find({})
                .populate('requesterId accepterId')
                .populate('busId routeId branchId')
                .sort({ createdAt: -1 })
                .skip(options.skip)
                .limit(options.limit)
                .exec();

            const totalRequests = await RequestResponse.countDocuments({});

            const totalPages = Math.ceil(totalRequests / limit);

            return res.json({
                status: true,
                message: 'Requests retrieved Successfully',
                data: {
                    requests,
                    currentPage: page,
                    totalPages,
                    totalRequests,
                    perPage: limit,
                }
            });
        } catch (err) {
            res.status(500).json({ status: false, message: err.message });
        }
    },

    async getRequestById(req, res) {
        try {
            const requestId = req.params.id;

            const request = await RequestResponse.findById(requestId)
                .populate('requester')
                .populate('accepter')
                .populate('bus');

            if (!request) {
                return res.status(404).json({ status: false, message: 'Request not found' });
            }

            return res.json({ status: true, message: 'Request fetched Successfully', data: request });

        } catch (err) {
            return res.status(500).json({ status: false, message: err.message || 'Something went wrong', data: {} });
        }
    },

    async updateRequestStatus(req, res) {
        try {
            const updates = req.body.updates;
            const isAdminOrBranchAdmin = req.user.role === 'admin' || req.user.role === 'branchAdmin';
            updates.forEach(async update => {
                const updateFields = {
                    status: update.status,
                    isActive: false
                };

                if (isAdminOrBranchAdmin) {
                    updateFields.accepterType = req.user.role;
                    updateFields.accepterId = req.user._id;
                }
                const requestResponseResult = await RequestResponse.findById(update.id)
                if (requestResponseResult.isActive) {
                    if (requestResponseResult.requestType == 'ADMIN_BUS_ASSIGNMENT_DRIVER') {
                        if (update.status === 'Accepted') {
                            if (requestResponseResult.accepterType === 'driver') {

                                const updatedBuswithDriver = await Bus.findByIdAndUpdate(
                                    requestResponseResult.busId,
                                    { $set: { driverId: requestResponseResult.accepterId } },
                                    { new: true }
                                );
                                const updatedDriverWithBus = await DriverProfile.findByIdAndUpdate(
                                    req.user.driverProfile._id,
                                    { $set: { busId: requestResponseResult.busId } },
                                    { new: true }
                                );


                            }

                            // if (updateFields.accepterType === 'student') {
                            //     // Add accepterId to the studentIds array for the bus
                            //     const updatedBus = await Bus.findByIdAndUpdate(
                            //         update.busId,
                            //         { $push: { studentIds: update.accepterId } },
                            //         { new: true }
                            //     );

                            //     console.log('After Update:', updatedBus);
                            // }

                            // console.log('Update Result:', updatedBus);
                        } else {
                            // send decline notification
                        }
                    }
                    if (requestResponseResult.requestType == 'ADMIN_BUS_ASSIGNMENT_STUDENT') {
                        if (update.status === 'Accepted') {
                            if (requestResponseResult.accepterType === 'student') {

                                const updatedBuswithStudent = await Bus.findByIdAndUpdate(
                                    requestResponseResult.busId,
                                    { $push: { studentIds: requestResponseResult.accepterId } },
                                    { new: true }
                                );
                                const updatedStudentWithBus = await StudentProfile.findByIdAndUpdate(
                                    req.user.studentProfile._id,
                                    { $set: { busId: requestResponseResult.busId } },
                                    { new: true }
                                );
                            }

                            // if (updateFields.accepterType === 'student') {
                            //     // Add accepterId to the studentIds array for the bus
                            //     const updatedBus = await Bus.findByIdAndUpdate(
                            //         update.busId,
                            //         { $push: { studentIds: update.accepterId } },
                            //         { new: true }
                            //     );

                            //     console.log('After Update:', updatedBus);
                            // }

                            // console.log('Update Result:', updatedBus);
                        } else {
                            // send decline notification
                        }
                    }
                }
                const result = await RequestResponse.updateOne({ _id: update.id }, { $set: { ...updateFields } });


            });

            return res.json({ status: true, message: 'Request Responded successfully' });
        } catch (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
    },
};

module.exports = requestController;
