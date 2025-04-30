import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import CreatePetProfile from './pages/CreatePetProfile';
import ViewPetProfiles from './pages/ViewPetProfiles';
import './App.css';

function App() {
  const [petProfiles, setPetProfiles] = useState([
    { id: 1, petType: 'Dog', age: 2, photo: 'url1', adoptionStatus: 'Available', contactNumber: '1234567890' },
    { id: 2, petType: 'Cat', age: 1, photo: 'url2', adoptionStatus: 'Adopted', contactNumber: '0987654321' },
  ]);

  const addPetProfile = (newProfile) => {
    setPetProfiles([...petProfiles, { ...newProfile, id: petProfiles.length + 1 }]);
  };

  const updatePetProfile = (id, updatedProfile) => {
    setPetProfiles(
      petProfiles.map((profile) =>
        profile.id === id ? { ...profile, ...updatedProfile } : profile
      )
    );
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/create-pet-profile"
          element={<CreatePetProfile addPetProfile={addPetProfile} />}
        />
        <Route
          path="/view-pet-profiles"
          element={
            <ViewPetProfiles
              petProfiles={petProfiles}
              updatePetProfile={updatePetProfile}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;