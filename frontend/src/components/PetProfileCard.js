import React from 'react';
import '../styles/petProfile.css';

function PetProfileCard({ pet }) {
  return (
    <div className="pet-profile-card">
      <img src={pet.photo} alt={pet.petType} className="pet-image" />
      <div className="pet-details">
        <h2 className="pet-name">{pet.name}</h2>
        <p className="pet-type">Type: {pet.petType}</p>
        <p className="pet-age">Age: {pet.age} years</p>
        <p className={`status ${pet.adoptionStatus.toLowerCase()}`}>
          Status: {pet.adoptionStatus}
        </p>
        <p className="contact">Contact: {pet.contactNumber}</p>
        {pet.breed && <p className="breed">Breed: {pet.breed}</p>}
        {pet.description && (
          <p className="description">About: {pet.description}</p>
        )}
      </div>
    </div>
  );
}

export default PetProfileCard;