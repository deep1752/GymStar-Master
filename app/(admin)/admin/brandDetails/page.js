'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAdmin } from '@/context/AdminContext';

export default function BrandDetails() {
  const { 
    adminDetails, 
    updateAdminDetails,
    loading 
  } = useAdmin();

  const [editField, setEditField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');

  if (loading || !adminDetails) {
    return <div className="admin-profile-loading">Loading...</div>;
  }

  const handleEdit = (field, currentValue) => {
    setEditField(field);
    setFieldValue(currentValue);
  };

  const handleSave = async () => {
    try {
      if (!editField) return;

      const updated = { ...adminDetails, [editField]: fieldValue };
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/update/${adminDetails.id}`, updated);
      updateAdminDetails(updated);
      toast.success('Admin details updated');
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
      <h2>Admin Brand Details</h2>
      {renderRow('Brand Name', 'brand_name', adminDetails.brand_name)}
      {renderRow('Email', 'email', adminDetails.email)}
      {renderRow('Mobile Number', 'mobile_number', adminDetails.mobile_number)}
      {renderRow('Address', 'address', adminDetails.address)}
      {renderRow('Twitter', 'twiter_link', adminDetails.twiter_link)}
      {renderRow('LinkedIn', 'linkedin_link', adminDetails.linkedin_link)}
      {renderRow('Facebook', 'fb_link', adminDetails.fb_link)}
      {renderRow('Instagram', 'insta_link', adminDetails.insta_link)}
      {renderRow('YouTube', 'youtube_link', adminDetails.youtube_link)}
      {renderRow('Experience (Years)', 'expirence_in_year', adminDetails.expirence_in_year)}
      {renderRow('Completed Projects', 'complet_project_numbers', adminDetails.complet_project_numbers)}
      {renderRow('Happy Clients', 'happy_clint_numbers', adminDetails.happy_clint_numbers)}
    </div>
  );
}