import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../styles/petProfile.css';

function CreatePetProfile() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    description: '',
    images: null,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setApiError('');
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('breed', formData.breed);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('description', formData.description);
      if (formData.images) {
        formDataToSend.append('images', formData.images);
      }

      await axios.post('http://localhost:5000/api/pets', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });
      
      navigate('/view-pet-profiles');
    } catch (err) {
      console.error('Create pet error:', err.response?.data?.msg || err.message);
      setApiError(err.response?.data?.msg || 'Failed to create pet profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="pet-profile-container">
        <h1>Create Pet Profile</h1>
        {apiError && <div className="api-error">{apiError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Pet Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleChange} 
              required 
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="input-group">
            <label>Type (Dog, Cat, etc.)</label>
            <input 
              type="text" 
              name="type" 
              value={formData.type}
              onChange={handleChange} 
              required 
            />
            {errors.type && <span className="error">{errors.type}</span>}
          </div>
          <div className="input-group">
            <label>Breed</label>
            <input 
              type="text" 
              name="breed" 
              value={formData.breed}
              onChange={handleChange} 
            />
          </div>
          <div className="input-group">
            <label>Age</label>
            <input 
              type="number" 
              name="age" 
              value={formData.age}
              onChange={handleChange} 
              required 
            />
            {errors.age && <span className="error">{errors.age}</span>}
          </div>
          <div className="input-group">
            <label>Gender</label>
            <select 
              name="gender" 
              value={formData.gender}
              onChange={handleChange} 
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description}
              onChange={handleChange} 
            />
          </div>
          <div className="input-group">
            <label>Photo</label>
            <input 
              type="file" 
              name="images" 
              onChange={handleFileChange} 
              accept="image/*"
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePetProfile;