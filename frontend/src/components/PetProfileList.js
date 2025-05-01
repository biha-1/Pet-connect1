import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetProfileCard from './PetProfileCard';
import '../styles/PetProfileList.css';

const PetProfileList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pets');
        setPets(response.data.data); // Access the 'data' property from the response
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        console.error('Error fetching pets:', err);
      }
    };

    fetchPets();
  }, []);

  if (loading) return <div className="loading-message">Loading pet profiles...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="pet-profile-list">
      <h2>Available Pets</h2>
      <div className="profiles-container">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <PetProfileCard 
              key={pet._id} 
              pet={pet} 
            />
          ))
        ) : (
          <p className="no-pets-message">No pet profiles found.</p>
        )}
      </div>
    </div>
  );
};

export default PetProfileList;