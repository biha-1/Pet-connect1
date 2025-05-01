import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import * as XLSX from 'xlsx';
import '../styles/petProfile.css';

function ViewPetProfiles() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({
    name: '',
    petType: '',
    age: '',
    photo: '',
    adoptionStatus: '',
    contactNumber: '',
    breed: '',
    description: ''
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pets');
      setPets(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      console.error('Error fetching pets:', err);
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to delete pets');
        return;
      }

      if (window.confirm('Are you sure you want to delete this pet profile?')) {
        await axios.delete(`http://localhost:5000/api/pets/${petId}`, {
          headers: { 'x-auth-token': token }
        });
        fetchPets(); // Refresh the list
        alert('Pet profile deleted successfully');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Failed to delete pet: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEditClick = (pet) => {
    setEditingPet(pet);
    setUpdatedDetails({
      name: pet.name,
      petType: pet.petType,
      age: pet.age,
      photo: pet.photo,
      adoptionStatus: pet.adoptionStatus,
      contactNumber: pet.contactNumber,
      breed: pet.breed || '',
      description: pet.description || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdatePet = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to update pets');
        return;
      }

      await axios.put(
        `http://localhost:5000/api/pets/${editingPet._id}`,
        updatedDetails,
        { headers: { 'x-auth-token': token } }
      );

      fetchPets(); // Refresh the list
      setEditingPet(null);
      alert('Pet profile updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      alert(`Failed to update pet: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDownloadReport = () => {
    // Prepare data for Excel
    const reportData = pets.map(pet => ({
      'Pet Name': pet.name || 'N/A',
      'Type': pet.petType || 'N/A',
      'Age': pet.age || 'N/A',
      'Breed': pet.breed || 'N/A',
      'Adoption Status': pet.ad
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pet Report');
    
    // Generate Excel file
    XLSX.writeFile(workbook, 'Pet_Report.xlsx', {
      compression: true
    });
  };

  if (loading) return <div className="loading">Loading pet profiles...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="view-pets-page">
      <Navbar />
      <div className="container">
        <div className="header-section">
          <h1>Available Pets</h1>
          <button 
            className="download-report-btn"
            onClick={handleDownloadReport}
            disabled={pets.length === 0}
          >
            Download Excel Report
          </button>
        </div>
        
        <div className="pet-profiles-grid">
          {pets.map((pet) => (
            <div key={pet._id} className="pet-profile-card">
              <img src={pet.photo} alt={pet.name} className="pet-image" />
              <div className="pet-info">
                <h2>{pet.name}</h2>
                <p><strong>Type:</strong> {pet.petType}</p>
                <p><strong>Age:</strong> {pet.age}</p>
                <p><strong>Status:</strong> {pet.adoptionStatus}</p>
                <p><strong>Contact:</strong> {pet.contactNumber}</p>
                {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
              </div>
              
              <div className="pet-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEditClick(pet)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeletePet(pet._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingPet && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <h2>Edit {editingPet.name}'s Details</h2>
              
              <div className="form-group">
                <label>Pet Name:</label>
                <input
                  type="text"
                  name="name"
                  value={updatedDetails.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Pet Type:</label>
                <select
                  name="petType"
                  value={updatedDetails.petType}
                  onChange={handleInputChange}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
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
                <select
                  name="adoptionStatus"
                  value={updatedDetails.adoptionStatus}
                  onChange={handleInputChange}
                >
                  <option value="Available">Available</option>
                  <option value="Adopted">Adopted</option>
                  <option value="Fostered">Fostered</option>
                </select>
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

              <div className="form-group">
                <label>Breed (optional):</label>
                <input
                  type="text"
                  name="breed"
                  value={updatedDetails.breed}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Description (optional):</label>
                <textarea
                  name="description"
                  value={updatedDetails.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-actions">
                <button className="save-btn" onClick={handleUpdatePet}>
                  Save Changes
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => setEditingPet(null)}
                >
                  Cancel
                </button>
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