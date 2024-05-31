import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '', skills: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Verificar que el token está presente
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        const res = await axios.get('http://localhost:5000/api/users/me', config);
        console.log('Response data:', res.data); // Verificar los datos de la respuesta
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
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

      console.log('Sending user data:', user);

      const res = await axios.put('http://localhost:5000/api/users/profile', user, config);
      console.log('Response data:', res.data);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      setError('Error updating profile');
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-primary">Update Profile</button>
          {error && <p className="text-danger">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default Profile;
