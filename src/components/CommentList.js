// src/components/CommentList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Comment from './Comment';
import './CommentList.css';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        const res = await axios.get(`http://localhost:5000/api/comments/${postId}`, config);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [postId]);

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

      const body = JSON.stringify({ text });
      const res = await axios.post(`http://localhost:5000/api/comments/${postId}`, body, config);

      setComments([res.data, ...comments]); // Añadir el nuevo comentario al principio
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="comment-section mt-4">
      <form onSubmit={handleSubmit} className="mb-3 create-post-form">
        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="Add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Comment</button>
      </form>
      <div className="comments">
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
