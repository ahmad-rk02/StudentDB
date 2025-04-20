import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProfile(data.user);
        setForm({ username: data.user.username, email: data.user.email, password: '' });
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
  }, [API_BASE]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const body = {};
      if (form.username) body.username = form.username;
      if (form.email) body.email = form.email;
      if (form.password) body.password = form.password;

      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile(data.user);
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      logout();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}
      <div className="profile-info">
        <h4>Current Profile</h4>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
      <hr />
      <div className="profile-form">
        <h4>Update Profile</h4>
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter new username"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter new email"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
          <button type="submit" className="btn btn-primary">Update Profile</button>
        </form>
      </div>
      <hr />
      <div className="delete-section">
        <h4>Delete Account</h4>
        <button onClick={handleDelete} className="btn btn-danger">Delete My Account</button>
      </div>
    </div>
  );
};

export default Profile;
