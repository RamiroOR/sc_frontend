import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css'; // Import the custom CSS

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        const res = await axios.get(`http://localhost:5000/api/users/${userId}`, config);
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="user-profile-container">
      {user && (
        <div className="user-profile-card">
          <h1 className="user-profile-name">{user.name}</h1>
          <p className="user-profile-email">Email: {user.email}</p>
          <p className="user-profile-skills">Skills: {user.skills.join(', ')}</p>
          {/* Aquí puedes añadir más detalles del perfil del usuario */}
          <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Back</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
