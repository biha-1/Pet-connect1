import Pet from '../models/Pet.js';
import path from 'path';
import fs from 'fs';


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

// Delete pet
export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ 
        success: false,
        message: 'Pet not found' 
      });
    }

    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this pet' 
      });
    }

    await pet.remove();
    res.status(200).json({ 
      success: true,
      data: {} 
    });
  } catch (err) {
    console.error('Delete pet error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete pet',
      error: err.message 
    });
  }
};