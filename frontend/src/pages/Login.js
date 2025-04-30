import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../styles/login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
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
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Redirect to profile
      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err.response?.data?.msg || err.message);
      setApiError(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-container">
        <h1>Login</h1>
        {apiError && <div className="api-error">{apiError}</div>}
        <form onSubmit={handleSubmit}>
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
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
}

export default Login;