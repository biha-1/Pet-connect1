import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/PetProfileForm.css';

const PetProfileForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        gender: '',
        description: '',
        image: null
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            const response = await axios.post('/api/pets', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('Pet profile created successfully!');
            setTimeout(() => {
                navigate('/view-pet-profiles'); // Redirect to view profiles after success
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create pet profile');
            console.error('Error creating pet profile:', err);
        }
    };

    return (
        <div className="pet-profile-form">
            <h2>Create Pet Profile</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                {/* Add other form fields similarly */}
                <div className="form-group">
                    <label>Species:</label>
                    <input 
                        type="text" 
                        name="species" 
                        value={formData.species} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Breed:</label>
                    <input 
                        type="text" 
                        name="breed" 
                        value={formData.breed} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Age:</label>
                    <input 
                        type="number" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Gender:</label>
                    <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Description:</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Image:</label>
                    <input 
                        type="file" 
                        name="image" 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        required 
                    />
                </div>
                
                <button type="submit" className="submit-button">Create Profile</button>
            </form>
        </div>
    );
};

export default PetProfileForm;