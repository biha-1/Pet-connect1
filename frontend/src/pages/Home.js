import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/login.css';


function Home() {
  return (
    <div>
      <Navbar />
      <div className="login-container">
        <h1>Welcome to Pet Connect</h1>
        <p>Find your perfect pet companion today!</p>
        <div className="button-group">
          <Link to="/signup" className="home-button">Sign Up</Link>
          <Link to="/login" className="home-button">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;