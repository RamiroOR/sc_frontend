import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreatePost from './CreatePost';
import Post from './Post';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.get('http://localhost:5000/api/posts', config);
      setPosts(res.data);
      console.log('Posts fetched:', res.data); // Debug statement
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.get('http://localhost:5000/api/users/me', config);
      setUser(res.data);
      console.log('User fetched:', res.data); // Debug statement
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUser();

    const interval = setInterval(() => {
      fetchPosts();
    }, 5000); // Fetch new posts every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId) => {
    setPosts(posts.map((post) =>
      post._id === postId ? { ...post, likes: [...(post.likes || []), { user: user._id }] } : post
    ));
  };

  return (
    <div className="container-fluid dashboard">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-dark sidebar">
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/profile">
                  <i className="fas fa-user"></i> Profile
                </Link>
              </li>
              <li className="nav-item mt-4">
                <button className="btn btn-danger btn-block" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </li>
            </ul>
            {user && (
              <div className="user-info text-center mt-4">
                <img src="/profile-pic.jpg" alt="Profile" className="img-fluid rounded-circle mb-3 profile-pic" />
                <p className="text-white">Welcome, {user.name}!</p>
                <p className="text-white">Skills: {user.skills.join(', ')}</p>
              </div>
            )}
          </div>
        </nav>

        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4 main-content">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
          </div>
          <div className="content">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <CreatePost onPostCreated={handlePostCreated} />
                <div className="card mb-4 shadow-sm mt-4">
                  <div className="card-header bg-primary text-white">
                    <h4 className="my-0 font-weight-normal">Feed</h4>
                  </div>
                  <div className="card-body">
                    {posts.map((post) => (
                      <Post key={post._id} post={post} onLike={handleLike} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
