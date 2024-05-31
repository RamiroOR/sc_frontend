// src/components/Comment.js
import React from 'react';
import './Comment.css';

const Comment = ({ comment }) => {
  return (
    <div className="comment mb-2 p-2">
      <p className="mb-1">{comment.text}</p>
      <small>By: {comment.user ? comment.user.name : 'Unknown'}</small>
    </div>
  );
};

export default Comment;
