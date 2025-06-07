"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';

/**
 * Profile Page Component
 * Displays and allows editing of user profile information
 */
const ProfilePage = () => {
  // Get user data and methods from context
  const { user, logout, token, setUser } = useUser();
  const router = useRouter();
  
  // State for tracking which field is being edited
  const [editField, setEditField] = useState(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    age: '',
    gender: '',
    email: '',
  });

  /**
   * Effect to handle:
   * 1. Redirect if user is not logged in
   * 2. Initialize form data when user data is available
   */
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setFormData({
        name: `${user.first_name} ${user.last_name}`,
        mobile: user.mobile || '',
        age: user.age || '',
        gender: user.gender || '',
        email: user.email || '',
      });
    }
  }, [user]);

  /**
   * Handles user logout
   */
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  /**
   * Handles form input changes with validation
   * @param {Object} e - Event object from input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Special handling for mobile field
    if (name === 'mobile') {
      // Allow only digits and max 10 characters
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }
  
    // Special handling for age field
    if (name === 'age') {
      if (!/^\d*$/.test(value)) return;
    }
  
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  /**
   * Handles updating user profile information
   * @param {string} field - The field being updated
   */
  const handleUpdate = async (field) => {
    // Field-specific validations
    if (field === 'name') {
      if (!formData.name.trim() || formData.name.trim().split(/\s+/).length < 2) {
        toast.error('Please enter both first and last name.');
        return;
      }
    }

    if (field === 'mobile') {
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(formData.mobile)) {
        toast.error('Mobile number must be exactly 10 digits.');
        return;
      }
    }

    if (field === 'age') {
      if (!/^\d+$/.test(formData.age)) {
        toast.error('Age must be a valid integer.');
        return;
      }
    }

    // Prepare data for API request
    let updatedData = {
      first_name: user.first_name,
      last_name: user.last_name,
      mobile: formData.mobile,
      age: formData.age,
      gender: formData.gender,
      email: formData.email,
    };

    // Special handling for name field (split into first/last)
    if (field === 'name') {
      const [first_name, ...rest] = formData.name.trim().split(/\s+/);
      updatedData.first_name = first_name;
      updatedData.last_name = rest.join(' ') || '';
    } else {
      updatedData[field] = formData[field];
    }

    try {
      // Make API request to update user
      const response = await axios.put(
        `http://127.0.0.1:8000/users/update/${user.id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Handle successful update
      toast.success(`${field} updated successfully!`);
      setEditField(null);
      setUser(response.data);
    } catch (error) {
      // Handle errors
      const errorMsg = error.response?.data?.detail || error.message;
    
      // Special handling for duplicate mobile error
      if (errorMsg.includes('mobile number already exists')) {
        toast.error('This mobile number is already registered.');
      } else {
        toast.error(`Failed to update ${field}.`);
      }
    }
  };

  // Show loading state if user data isn't available yet
  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <h1 className="profile-title">Your Profile</h1>
        <p className="profile-subtitle">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        {/* Name Field */}
        <div className="profile-field-group">
          <label className="profile-field-label">Full Name</label>
          <div className="profile-field-wrapper">
            <input
              type="text"
              name="name"
              className="profile-input"
              value={formData.name}
              onChange={handleChange}
              readOnly={editField !== 'name'}
            />
            {editField !== 'name' ? (
              <button
                className="edit-btn"
                onClick={() => setEditField('name')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            ) : (
              <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="save-btn"
                  onClick={() => handleUpdate('name')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditField(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Field */}
        <div className="profile-field-group">
          <label className="profile-field-label">Mobile Number</label>
          <div className="profile-field-wrapper">
            <input
              type="text"
              name="mobile"
              className="profile-input"
              value={formData.mobile}
              onChange={handleChange}
              readOnly={editField !== 'mobile'}
            />
            {editField !== 'mobile' ? (
              <button
                className="edit-btn"
                onClick={() => setEditField('mobile')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            ) : (
              <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="save-btn"
                  onClick={() => handleUpdate('mobile')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditField(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Age Field */}
        <div className="profile-field-group">
          <label className="profile-field-label">Age</label>
          <div className="profile-field-wrapper">
            <input
              type="text"
              name="age"
              className="profile-input"
              value={formData.age}
              onChange={handleChange}
              readOnly={editField !== 'age'}
            />
            {editField !== 'age' ? (
              <button
                className="edit-btn"
                onClick={() => setEditField('age')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            ) : (
              <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="save-btn"
                  onClick={() => handleUpdate('age')}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditField(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Email Field (Read Only) */}
        <div className="profile-field-group">
          <label className="profile-field-label">Email</label>
          <div className="profile-field-wrapper">
            <input
              type="email"
              name="email"
              className="profile-input"
              value={formData.email}
              readOnly
            />
            <div className="read-only-indicator">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Gender Field (Read Only) */}
        <div className="profile-field-group">
          <label className="profile-field-label">Gender</label>
          <div className="profile-field-wrapper">
            <input
              type="text"
              name="gender"
              className="profile-input"
              value={formData.gender}
              readOnly
            />
            <div className="read-only-indicator">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
          <Link href="/subscription" className="subscription-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            Subscriptions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;