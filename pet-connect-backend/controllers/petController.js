import Pet from '../models/Pet.js';
import mongoose from 'mongoose';

// Create a pet profile
export const createPet = async (req, res) => {
  try {
    const { petType, name, age, photo, adoptionStatus, contactNumber, breed, description } = req.body;
    
    const newPet = new Pet({
      petType,
      name,
      age,
      photo,
      adoptionStatus,
      contactNumber,
      breed,
      description,
      owner: req.user.id
    });

    const savedPet = await newPet.save();
    res.status(201).json(savedPet);
  } catch (err) {
    console.error('Create pet error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create pet profile',
      error: err.message 
    });
  }
};

// Get all pets
export const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find()
      .select('petType name age photo adoptionStatus contactNumber breed description owner createdAt')
      .populate('owner', 'username email');
      
    res.status(200).json({ 
      success: true,
      count: pets.length,
      data: pets 
    });
  } catch (err) {
    console.error('Get all pets error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch pets',
      error: err.message 
    });
  }
};

// Get single pet
export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('owner', 'username email');
      
    if (!pet) {
      return res.status(404).json({ 
        success: false,
        message: 'Pet not found' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      data: pet 
    });
  } catch (err) {
    console.error('Get pet by ID error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch pet',
      error: err.message 
    });
  }
};

// Update pet
export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ 
        success: false,
        message: 'Pet not found' 
      });
    }

    // Verify ownership
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this pet' 
      });
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true,
      data: updatedPet 
    });
  } catch (err) {
    console.error('Update pet error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update pet',
      error: err.message 
    });
  }
};

// Delete pet - FIXED VERSION
export const deletePet = async (req, res) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid pet ID format'
      });
    }

    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ 
        success: false,
        message: 'Pet not found' 
      });
    }

    // Verify ownership
    if (pet.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this pet' 
      });
    }

    // FIX: Using deleteOne() instead of remove()
    await Pet.deleteOne({ _id: req.params.id });
    
    res.status(200).json({ 
      success: true,
      message: 'Pet successfully deleted',
      deletedId: req.params.id
    });
    
  } catch (err) {
    console.error('Delete pet error:', {
      message: err.message,
      stack: err.stack,
      params: req.params
    });
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during deletion',
      error: err.message 
    });
  }
};