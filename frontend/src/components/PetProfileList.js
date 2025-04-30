import React, { useState, useEffect } from 'react';
import PetProfileCard from './PetProfileCard';
import axios from 'axios';
import '../styles/PetProfileList.css';

const PetProfileList = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await axios.get('/api/pets'); // Adjust API endpoint as needed
                setPets(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching pets:', err);
            }
        };

        fetchPets();
    }, []);

    if (loading) return <div>Loading pet profiles...</div>;
    if (error) return <div>Error: {error}</div>;

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
                    <p>No pet profiles found.</p>
                )}
            </div>
        </div>
    );
};

export default PetProfileList;