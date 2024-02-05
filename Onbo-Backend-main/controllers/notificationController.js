const notificationService = require('../services/notificationService');
const Notification = require('../models/notification');

const createNotifications = async (req, res) => {
  try {
    const notificationsData = req.body.notifications;

    const result = await notificationService.createNotifications(req.user, notificationsData);

    if (result.status) {
      return res.json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Something went Wrong', data: {} });
  }
};


const getAllNotifications = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const options = {
      limit: pageSize,
      skip: (page - 1) * pageSize,
    };

    const totalNotifications = await Notification.countDocuments({ $or: [{ senderId: userId }, { receiverId: userId }] });
    const notificationsResults = await Notification.find({ $or: [{ senderId: userId }, { receiverId: userId }] }).sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .exec();
    const totalPages = Math.ceil(notificationsResults / pageSize);


    return res.json({
      status: true,
      message: 'Requests Fetched Successfully',
      data: {
        currentPage: page,
        totalPages,
        totalNotifications,
        perPage: pageSize,
        notificationsResults,
      }
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message || 'Something went wrong', data: {} });
  }
};


const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({ _id: id })
      .populate([{
        path: 'receiverId',
        populate: 'studentProfile'
      },
      {
        path: 'senderId',
        populate: 'driverProfile'
      }
      ])
    if (!request) {
      return res.status(404).json({ status: false, message: 'Notification not found' });
    }

    return res.json({ status: true, message: 'Notification fetched Successfully', data: notification });

  } catch (err) {
    return res.status(500).json({ status: false, message: err.message || 'Something went wrong', data: {} });
  }
};

const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    return res.json({ status: true, message: 'Notification updated Successfully', data: updatedNotification });

  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  createNotifications,
  getAllNotifications,
  getNotificationById,
  updateNotification,
};
