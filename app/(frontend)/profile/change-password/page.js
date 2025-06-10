"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import axios from 'axios';

/**
 * Change Password Page Component
 * Allows users to update their account password
 */
const ChangePasswordPage = () => {
  // Initialize router for navigation
  const router = useRouter();
  
  // Get user data and token from context
  const { user, token } = useUser();

  // Form state
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: '',
  });

  // UI state
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Redirect to signup page if user is not authenticated
   */
  useEffect(() => {
    if (!user) {
      router.push('/join');
    }
  }, [user, router]);

  /**
   * Handles form input changes
   * @param {Object} e - Event object from input change
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission
   * @param {Object} e - Event object from form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccessMsg('');

    // Validate password match
    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      
      // Make API request to update password
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update-password/${user?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Handle success
      setSuccessMsg('Password updated successfully!');
      setFormData({ new_password: '', confirm_password: '' });
    } catch (err) {
      // Handle errors
      setError(err.response?.data?.detail || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Left Column: Security Information */}
        <div className="col-md-6 mb-4">
          <h2 className="mb-4">ACCOUNT SECURITY</h2>
          <p>
            Keep your account secure by updating your password regularly.
          </p>

          {/* Password Tips */}
          <h5 className="fw-bold">Tips:</h5>
          <ul className="list-group mb-4">
            <li className="list-group-item">✔️ Use a strong and unique password</li>
            <li className="list-group-item">✔️ Avoid using common passwords</li>
            <li className="list-group-item">✔️ Change your password every few months</li>
          </ul>
        </div>

        {/* Right Column: Password Change Form */}
        <div className="col-md-6">
          <h2 className="mb-4 text-center">Change Password</h2>

          {/* Error/Success Messages */}
          {error && <div className="alert alert-danger">{error}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          {/* Password Change Form */}
          <form onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div className="mb-3">
              <input
                type="password"
                name="new_password"
                placeholder="New Password"
                className="form-control"
                value={formData.new_password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="mb-3">
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                className="form-control"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-100" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;