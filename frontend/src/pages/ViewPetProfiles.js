import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../styles/petProfile.css';

function ViewPetProfiles({ petProfiles, updatePetProfile, fetchPets }) {
  const [editingProfile, setEditingProfile] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});

  const handleDeletePet = async (petId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to delete pets');
        return;
      }
  
      if (window.confirm('Are you sure you want to delete this pet profile?')) {
        console.log('Attempting to delete pet with ID:', petId); // Debug log
        
        const response = await axios.delete(`http://localhost:5000/api/pets/${petId}`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        console.log('Delete response:', response.data); // Debug log
        
        // Refresh the pet list after deletion
        if (response.data && response.data.msg === 'Pet removed') {
          fetchPets();
          alert('Pet profile deleted successfully');
        } else {
          throw new Error('Unexpected response from server');
        }
      }
    } catch (err) {
      console.error('Detailed delete error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      alert(`Failed to delete pet profile: ${err.response?.data?.msg || err.message}`);
    }
  };

  const handleEditClick = (profile) => {
    setEditingProfile(profile);
    setUpdatedDetails({
      petType: profile.petType,
      age: profile.age,
      photo: profile.photo,
      adoptionStatus: profile.adoptionStatus,
      contactNumber: profile.contactNumber
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    updatePetProfile(editingProfile.id, updatedDetails);
    setEditingProfile(null);
  };

  const handleDownloadReport = () => {
    console.log('Downloading report...');
    alert('Report downloaded!');
  };

  return (
    <div>
      <Navbar />
      <div className="pet-profile-container">
        <h1>View Pet Profiles</h1>
        <button className="download-report-button" onClick={handleDownloadReport}>
          Download Report
        </button>
        
        <div className="pet-profiles-grid">
          {petProfiles.map((profile) => (
            <div key={profile.id} className="pet-profile-card">
              <div className="card-content">
                <img src={profile.photo} alt={profile.petType} />
                <h2>{profile.petType}</h2>
                <p>Age: {profile.age}</p>
                <p>Status: {profile.adoptionStatus}</p>
                <p>Contact: {profile.contactNumber}</p>
              </div>
              
              <div className="card-actions">
                <button onClick={() => handleEditClick(profile)}>Update</button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeletePet(profile.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {editingProfile && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <h2>Edit {editingProfile.petType}'s Details</h2>
              <div className="form-group">
                <label>Pet Type:</label>
                <input
                  type="text"
                  name="petType"
                  value={updatedDetails.petType}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={updatedDetails.age}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Photo URL:</label>
                <input
                  type="text"
                  name="photo"
                  value={updatedDetails.photo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Adoption Status:</label>
                <input
                  type="text"
                  name="adoptionStatus"
                  value={updatedDetails.adoptionStatus}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Contact Number:</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={updatedDetails.contactNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditingProfile(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        
        <Link to="/profile" className="back-link">Back to Profile</Link>
      </div>
    </div>
  );
}

export default ViewPetProfiles;