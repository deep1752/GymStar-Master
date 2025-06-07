'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ChangePassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const storedAdmin = localStorage.getItem("admin_user");

    if (!token || !storedAdmin) {
      toast.error('Unauthorized. Please login.');
      router.push('/admin');
      return;
    }

    setAdmin(JSON.parse(storedAdmin));
  }, [router]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Both fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      await axios.put(
        `http://127.0.0.1:8000/users/update-password/${admin.id}`,
        {
          new_password: newPassword,
          confirm_password: confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Password changed successfully!');
      router.push('/admin/profile');
    } catch (error) {
      console.error(error);
      toast.error('Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  return (
    <div className="change-password-container">
      <h2 className="change-password-title">Change Password</h2>
      <form onSubmit={handleChangePassword} className="change-password-form">
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`submit-btn ${loading ? 'btn-disabled' : ''}`}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
