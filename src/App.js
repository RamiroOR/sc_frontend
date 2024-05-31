import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Router>
  );
};

export default App;
