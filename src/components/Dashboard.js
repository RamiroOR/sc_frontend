import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import CreatePost from './CreatePost';
import Post from './Post';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
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
      } catch (err) {
        console.error(err);
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

        // Connect to Socket.IO server after fetching user data
        const socket = io('http://localhost:5000', {
          auth: {
            token,
          },
        });

        // Handle incoming notifications
        socket.on('notification', (notification) => {
          setNotifications((prevNotifications) => [notification, ...prevNotifications]);
        });

        return () => {
          socket.disconnect();
        };
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
    fetchUser();
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
                <Link className="nav-link active text-white" to="/dashboard">
                  <i className="fas fa-home"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/profile">
                  <i className="fas fa-user"></i> Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/messages">
                  <i className="fas fa-envelope"></i> Messages
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/notifications">
                  <i className="fas fa-bell"></i> Notifications
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/settings">
                  <i className="fas fa-cog"></i> Settings
                </Link>
              </li>
              <li className="nav-item mt-4">
                <button className="btn btn-danger btn-block" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4 main-content">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
          </div>
          <div className="content">
            <div className="row">
              <div className="col-md-4">
                <div className="card mb-4 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h4 className="my-0 font-weight-normal">Profile</h4>
                  </div>
                  <div className="card-body text-center">
                    {user && (
                      <>
                        <img src="/profile-pic.jpg" alt="Profile" className="img-fluid rounded-circle mb-3" />
                        <p>Welcome, {user.name}!</p>
                        <p>Skills: {user.skills.join(', ')}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
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
                <div className="card mb-4 shadow-sm mt-4">
                  <div className="card-header bg-primary text-white">
                    <h4 className="my-0 font-weight-normal">Notifications</h4>
                  </div>
                  <div className="card-body">
                    {notifications.length > 0 ? (
                      <ul>
                        {notifications.map((notification) => (
                          <li key={notification._id}>
                            {notification.message} - {notification.read ? 'Read' : 'Unread'}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No notifications</p>
                    )}
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
