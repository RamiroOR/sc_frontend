import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css'; // Import the custom CSS

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', skills: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        const res = await axios.get('http://localhost:5000/api/users/me', config);
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSkillsChange = (e) => {
    setUser({ ...user, skills: e.target.value.split(',').map(skill => skill.trim()) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };

      const res = await axios.put('http://localhost:5000/api/users/profile', user, config);
      setUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      setError('Error updating profile');
    }
  };

  return (
    <div className="profile-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <h2 className="mb-4">Profile</h2>
          {success && <div className="alert alert-success">Profile updated successfully!</div>}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              className="form-control"
              value={user.skills.join(', ')}
              onChange={handleSkillsChange}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Update Profile</button>
          {error && <p className="text-danger mt-3">{error}</p>}
          <button type="button" className="btn btn-secondary btn-block mt-2" onClick={() => navigate(-1)}>Back</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
