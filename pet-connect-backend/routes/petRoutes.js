import express from 'express';
import { createPet, getAllPets, getUserPets, updatePet, deletePet } from '../controllers/petController.js';
import auth from '../middlewares/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer(); // Simple in-memory storage for files


// Use multer middleware for file uploads
router.post('/', auth, upload.single('images'), createPet);

// Other routes remain the same
router.get('/', getAllPets);
router.get('/user', auth, getUserPets);
router.put('/:id', auth, updatePet);
router.delete('/:id', auth, deletePet);

export default router;