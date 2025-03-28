import React, { useEffect, useState } from 'react';
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    userId: '',
    password: '',
    newPassword: '',
  });

  const [originalUser, setOriginalUser] = useState(null); // Ensure null initially
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          userId: data.userId || '',
          password: '',
          newPassword: '',
        });
        setOriginalUser(data);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value || '',
    }));
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleCloseClick = () => {
    if (originalUser) {
      setUser({
        firstName: originalUser.firstName || '',
        lastName: originalUser.lastName || '',
        email: originalUser.email || '',
        phoneNumber: originalUser.phoneNumber || '',
        userId: originalUser.userId || '',
        password: '',
        newPassword: '',
      });
    }
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!user.password) {
      setError('Please enter your current password.');
      return;
    }

    const updatedProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      password: user.password,
    };

    if (user.newPassword && user.newPassword.trim() !== '') {
      updatedProfile.newPassword = user.newPassword;
    }

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Profile updated successfully!');
        setUser((prevUser) => ({
          ...prevUser,
          password: '',
          newPassword: '',
        }));
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit}>
          <h2>Account Info</h2>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <label>First Name</label>
          <input type="text" name="firstName" value={user.firstName} onChange={handleChange} readOnly={!isEditing} />

          <label>Last Name</label>
          <input type="text" name="lastName" value={user.lastName} onChange={handleChange} readOnly={!isEditing} />

          <label>Email</label>
          <input type="email" name="email" value={user.email} readOnly />

          <label>Phone Number</label>
          <input type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} readOnly={!isEditing} />

          <label>User ID</label>
          <input type="text" name="userId" value={user.userId} readOnly />

          {isEditing && (
            <>
              <label>Password</label>
              <input type="password" name="password" value={user.password} onChange={handleChange} required />

              <label>New Password (Optional)</label>
              <input type="password" name="newPassword" value={user.newPassword} onChange={handleChange} />
            </>
          )}

          {isEditing ? (
            <div className="button-group">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="close-profile-btn" onClick={handleCloseClick}>Close</button>
            </div>
          ) : (
            <button type="button" className="update-btn" onClick={handleUpdateClick}>Update</button>
          )}
        </form>
      )}
    </div>
  );
};

export default Profile;
