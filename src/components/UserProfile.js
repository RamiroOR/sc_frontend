import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const { userId } = useParams();
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

        console.log(`Fetching profile for user ID: ${userId}`); // Log del ID de usuario
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`, config);
        console.log('User profile data:', res.data); // Log de la respuesta
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err); // Log de error
        setError('Error fetching user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      {user && (
        <div>
          <h1>{user.name}</h1>
          <p>Email: {user.email}</p>
          <p>Skills: {user.skills.join(', ')}</p>
          {/* Aquí puedes añadir más detalles del perfil del usuario */}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
