// controllers/authController.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { mockUsers } from '../utils/mockStore.js';

// Helper function to sign JWT
const generateToken = id => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'jobtrack_default_jwt_secret_key_2025',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, targetRole, institution } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email address, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists',
        });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        targetRole: targetRole || 'Software Development Engineer',
        institution: institution || 'B.Tech Computer Science & Engineering',
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          institution: user.institution,
          createdAt: user.createdAt,
        },
      });
    } else {
      // In-Memory Fallback
      const userExists = mockUsers.find(u => u.email === normalizedEmail);
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newMockUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        email: normalizedEmail,
        password: hashedPassword,
        targetRole: targetRole || 'Software Development Engineer',
        institution: institution || 'B.Tech Computer Science & Engineering',
        createdAt: new Date(),
      };
      mockUsers.push(newMockUser);

      const token = generateToken(newMockUser._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: newMockUser._id,
          name: newMockUser.name,
          email: newMockUser.email,
          targetRole: newMockUser.targetRole,
          institution: newMockUser.institution,
          createdAt: newMockUser.createdAt,
        },
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email address or password',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email address or password',
        });
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          institution: user.institution,
          createdAt: user.createdAt,
        },
      });
    } else {
      // In-Memory Fallback
      const user = mockUsers.find(u => u.email === normalizedEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email address or password',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email address or password',
        });
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          institution: user.institution,
          createdAt: user.createdAt,
        },
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during login',
    });
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me or GET /api/users/profile
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found',
        });
      }
      return res.status(200).json({ success: true, user });
    } else {
      const user = mockUsers.find(u => u._id.toString() === req.user._id.toString());
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found',
        });
      }
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json({ success: true, user: userWithoutPassword });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email, targetRole, institution, currentPassword, newPassword } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id).select('+password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (targetRole) user.targetRole = targetRole;
      if (institution) user.institution = institution;

      if (email && email.toLowerCase() !== user.email) {
        const emailExists = await User.findOne({ email: email.toLowerCase() });
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: 'That email is already registered by another account',
          });
        }
        user.email = email.toLowerCase();
      }

      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: 'Please provide current password to set a new password',
          });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: 'Current password is incorrect',
          });
        }
        if (newPassword.length < 6) {
          return res.status(400).json({
            success: false,
            message: 'New password must be at least 6 characters',
          });
        }
        user.password = newPassword;
      }

      const updatedUser = await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          targetRole: updatedUser.targetRole,
          institution: updatedUser.institution,
          updatedAt: updatedUser.updatedAt,
        },
      });
    } else {
      // In-Memory Fallback
      const user = mockUsers.find(u => u._id.toString() === req.user._id.toString());
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (targetRole) user.targetRole = targetRole;
      if (institution) user.institution = institution;

      if (email && email.toLowerCase() !== user.email) {
        const exists = mockUsers.find(u => u.email === email.toLowerCase());
        if (exists) {
          return res.status(400).json({
            success: false,
            message: 'That email is already registered by another account',
          });
        }
        user.email = email.toLowerCase();
      }

      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            message: 'Please provide current password to set a new password',
          });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: 'Current password is incorrect',
          });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole,
          institution: user.institution,
        },
      });
    }
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user profile',
    });
  }
};
