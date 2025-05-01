import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/petProfile.css';

function ViewPetProfiles() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});

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
      breed: pet.breed,
      description: pet.description
    });
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="view-pets-page">
      <Navbar />
      <div className="container">
        <h1>Available Pets</h1>
        
        <div className="pet-profiles-grid">
          {pets.map((pet) => (
            <div key={pet._id} className="pet-profile-card">
              <img src={pet.photo} alt={pet.name} />
              <h2>{pet.name}</h2>
              <p>Type: {pet.petType}</p>
              <p>Age: {pet.age}</p>
              <p>Status: {pet.adoptionStatus}</p>
              <p>Contact: {pet.contactNumber}</p>
              
              <div className="pet-actions">
                <button onClick={() => handleEditClick(pet)}>Edit</button>
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

        {editingPet && (
          <div className="edit-modal">
            <h2>Edit {editingPet.name}'s Details</h2>
            <div className="form-group">
              <label>Name:</label>
              <input
                name="name"
                value={updatedDetails.name}
                onChange={(e) => setUpdatedDetails({...updatedDetails, name: e.target.value})}
              />
            </div>
            {/* Add other fields similarly */}
            <div className="modal-actions">
              <button onClick={handleUpdatePet}>Save</button>
              <button onClick={() => setEditingPet(null)}>Cancel</button>
            </div>
          </div>
        )}

        <Link to="/profile" className="back-link">Back to Profile</Link>
      </div>
    </div>
  );
}

export default ViewPetProfiles;