const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

const authenticateToken = (requiredRoles) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: false, message: 'Unauthorized' });
  }

  jwt.verify(token, config.secretKey, async (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ status: false, message: 'Unauthorized' });;
    }

    // console.log('Decoded Token:', decoded);

    const { userId, role } = decoded;
    const user = await User.findById(userId)
      .populate('adminProfile')
      .populate('instituteAdminProfile')
      .populate('branchAdminProfile')
      .populate('studentProfile')
      .populate('driverProfile');
    if (user) {
      req.user = user
    } else {
      return res.status(401).json({ status: false, message: 'Unauthorized' });
    }

    if (requiredRoles && role && !requiredRoles.includes(role)) {
      console.error(`User does not have the required roles: ${requiredRoles}`);
      return res.status(403).json({ status: false, message: 'Forbidden' });;
    }

    next();
  });
};

module.exports = { authenticateToken };
