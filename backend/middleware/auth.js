// middleware/auth.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { mockUsers } from '../utils/mockStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'jobtrack_default_jwt_secret_key_2025'
      );

      let user = null;

      if (mongoose.connection.readyState === 1) {
        user = await User.findById(decoded.id).select('-password');
      } else {
        // Fallback to in-memory store
        user = mockUsers.find(u => u._id.toString() === decoded.id.toString());
        if (user) {
          const { password, ...userWithoutPassword } = user;
          user = userWithoutPassword;
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User account associated with this token no longer exists',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token validation failed or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided in request header',
    });
  }
};
