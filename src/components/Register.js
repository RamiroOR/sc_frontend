// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Importa 'Link' aquí
import './Login.css'; // Reutilizamos el mismo CSS que para el login

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ name, email, password });
      const res = await axios.post('http://localhost:5000/api/users/register', body, config);

      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.msg || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <div className="text-center">
                <img src="/logo.png" alt="Logo" className="logo mb-4" />
              </div>
              <h2 className="text-center">Register</h2>
              {error && <p className="text-danger text-center">{error}</p>}
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Register</button>
              </form>
              <p className="text-center mt-3">
                Already have an account? <Link to="/">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
