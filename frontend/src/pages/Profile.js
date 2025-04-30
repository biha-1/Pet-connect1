import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/profile.css';

function Profile() {
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    // Logic to delete account
    console.log('Account deleted!');
    navigate('/'); // Redirect to home page after deletion
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h1>Profile</h1>
        <div className="profile-details">
          <p>Name: John Doe</p>
          <p>Email: john@example.com</p>
        </div>
        <Link to="/create-pet-profile" className="add-pet-link">Add Pet Profile</Link>
        <Link to="/view-pet-profiles" className="view-pet-link">View Pet Profiles</Link>
        <button className="delete-profile-button" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  );
}

export default Profile;