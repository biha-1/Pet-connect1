import express from 'express';
import { register, login, getUser, updateUser } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get user profile (protected route)
router.get('/user', auth, getUser);

// Update user profile (protected route)
router.put('/user', auth, updateUser);

export default router;