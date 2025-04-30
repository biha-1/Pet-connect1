import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../styles/signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err.response?.data?.msg || err.message);
      setApiError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="signup-container">
        <h1>Sign Up</h1>
        {apiError && <div className="api-error">{apiError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username}
              onChange={handleChange} 
              required 
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange} 
              required 
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange} 
              required 
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        <div className="login-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;