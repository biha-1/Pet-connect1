import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css'; // Import navbar.css

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Pet Connect</div>
      <ul className="nav-links">
        <li className="nav-item"><Link to="/">Home</Link></li>
        <li className="nav-item"><Link to="/about">About</Link></li>
        <li className="nav-item"><Link to="/services">Services</Link></li>
        <li className="nav-item"><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;