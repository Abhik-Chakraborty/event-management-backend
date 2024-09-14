const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = (roles = []) => {
  return async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (roles.length && !roles.includes(req.user.role)) {
          return res.status(403).json({ message: 'Access denied' });
        }

        next();
      } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
      }
    } else {
      res.status(401).json({ message: 'No token provided' });
    }
  };
};
