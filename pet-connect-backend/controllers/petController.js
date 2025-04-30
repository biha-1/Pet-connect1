import Pet from '../models/Pet.js';

// Create a pet profile
export const createPet = async (req, res) => {
  try {
    const { name, type, breed, age, gender, description } = req.body;
    
    const newPet = new Pet({
      name,
      type,
      breed,
      age,
      gender,
      description,
      images: req.file ? req.file.path : null, // Assuming you're using multer for file uploads
      owner: req.user.id
    });

    const pet = await newPet.save();
    res.json(pet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all pets
export const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate('owner', ['username', 'profilePicture']);
    res.json(pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get pets by user
export const getUserPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id });
    res.json(pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update pet
export const updatePet = async (req, res) => {
  try {
    const { name, type, breed, age, gender, description } = req.body;
    
    let pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ msg: 'Pet not found' });

    // Check user owns the pet
    if (pet.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { $set: { name, type, breed, age, gender, description } },
      { new: true }
    );

    res.json(pet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete pet
import mongoose from 'mongoose';

// Delete pet
export const deletePet = async (req, res) => {
  try {
    console.log('Deleting pet with ID:', req.params.id);
    
    // First check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        msg: 'Invalid pet ID format',
        receivedId: req.params.id,
        expectedFormat: 'MongoDB ObjectId (24-character hex string)'
      });
    }

    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ msg: 'Pet not found' });
    }

    if (pet.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ msg: 'Not authorized to delete this pet' });
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: 'Pet successfully deleted' });
    
  } catch (err) {
    console.error('Delete error:', {
      message: err.message,
      stack: err.stack,
      params: req.params
    });
    res.status(500).json({ 
      success: false,
      msg: 'Server error during deletion',
      error: err.message
    });
  }
};

