import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CommentList from './CommentList';
import './Post.css';

const Post = ({ post, onLike }) => {
  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      await axios.post(`http://localhost:5000/api/likes/${post._id}/like`, {}, config);
      onLike(post._id);
    } catch (err) {
    }
  };

  return (
    <div className="card post-card mb-4 shadow-sm">
      <div className="card-body">
        <p>
          <strong>
            <Link to={`/user/${post.user._id}`}>{post.user.name}</Link> {/* Enlace al perfil del usuario */}
          </strong>
        </p>
        <p>{post.content}</p>
        <button onClick={handleLike} className="btn btn-outline-primary btn-sm">
          Like {post.likes ? post.likes.length : 0}
        </button>
        <CommentList postId={post._id} />
      </div>
    </div>
  );
};

export default Post;
