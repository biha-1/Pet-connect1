import React from 'react';
import '../styles/petProfile.css'; // Import petProfile.css

function PetProfileCard({ profile, onDelete, onEdit }) {
  return (
    <div className="pet-profile-card">
      <img src={profile.photo} alt={profile.petType} />
      <h2>{profile.petType}</h2>
      <p>Age: {profile.age}</p>
      <p>Status: {profile.adoptionStatus}</p>
      <p>Contact: {profile.contactNumber}</p>
      <button onClick={() => onEdit(profile.id)}>Edit</button>
      <button onClick={() => onDelete(profile.id)}>Delete</button>
    </div>
  );
}

export default PetProfileCard;