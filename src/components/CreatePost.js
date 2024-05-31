// src/components/CreatePost.js
import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ content });
      const res = await axios.post('http://localhost:5000/api/posts', body, config);

      onPostCreated(res.data); // Pasar el nuevo post al componente padre
      setContent('');
    } catch (err) {
    }
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
