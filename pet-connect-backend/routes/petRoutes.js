import express from 'express';
import {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet
} from '../controllers/petController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPets);
router.get('/:id', getPetById);

// Protected routes (require authentication)
router.post('/', auth, createPet);
router.put('/:id', auth, updatePet);
router.delete('/:id', auth, deletePet);

export default router;