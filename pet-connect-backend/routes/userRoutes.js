import express from 'express';
import { 
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword
} from '../controllers/userController.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js'; // Optional admin middleware

const router = express.Router();

// @route   GET api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', auth, admin, getAllUsers);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, getUserById);

// @route   PUT api/users
// @desc    Update user profile
// @access  Private
router.put('/', auth, updateUser);

// @route   DELETE api/users
// @desc    Delete user account
// @access  Private
router.delete('/', auth, deleteUser);

// @route   PUT api/users/password
// @desc    Change password
// @access  Private
router.put('/password', auth, changePassword);

export default router;