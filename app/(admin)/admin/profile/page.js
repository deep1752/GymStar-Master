'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAdmin } from '@/context/AdminContext';

export default function AdminProfile() {
  const { 
    admin: adminProfile, 
    token,
    updateAdminProfile,
    loading 
  } = useAdmin();

  const [editField, setEditField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');

  if (loading || !adminProfile) {
    return <div className="admin-profile-loading">Loading...</div>;
  }

  const handleEdit = (field, currentValue) => {
    setEditField(field);
    setFieldValue(currentValue);
  };

  const handleSave = async () => {
    try {
      if (!editField) return;

      const updated = { ...adminProfile, [editField]: fieldValue };
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update/${adminProfile.id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateAdminProfile(updated);
      toast.success('Profile updated');
      setEditField(null);
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Update failed');
    }
  };

  const handleCancel = () => {
    setEditField(null);
    setFieldValue('');
  };

  const renderRow = (label, key, value) => (
    <div className="admin-profile-row" key={key}>
      <strong>{label}:</strong>
      {editField === key ? (
        <>
          <input
            className="admin-profile-input"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
          />
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={handleCancel} className="cancel-btn">Cancel</button>
        </>
      ) : (
        <>
          <span>{value || 'Not specified'}</span>
          <button onClick={() => handleEdit(key, value)} className="edit-btn">✏️</button>
        </>
      )}
    </div>
  );

  return (
    <div className="admin-profile-container">
      <h2>Admin Profile</h2>
      {renderRow('First Name', 'first_name', adminProfile.first_name)}
      {renderRow('Last Name', 'last_name', adminProfile.last_name)}
      {renderRow('Email', 'email', adminProfile.email)}
      {renderRow('Mobile', 'mobile', adminProfile.mobile)}
      {renderRow('Age', 'age', adminProfile.age)}
      {renderRow('Gender', 'gender', adminProfile.gender)}
    </div>
  );
}

