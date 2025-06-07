'use client';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { useState, useRef, useEffect } from 'react';

export default function AdminHeader() {
  const { admin, logout, isAdminAuthenticated } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="admin-header">
      <div className="header-container">
        {/* Left navigation - only show when authenticated */}
        {isAdminAuthenticated && (
          <div className="nav-links">
            <Link href="/admin/dashboard" className="nav-link">Home</Link>
            <Link href="/admin/profile" className="nav-link">Profile</Link>
          </div>
        )}

        {/* Center welcome message */}
        <div className="welcome-message">
          {isAdminAuthenticated ? (
            <>Welcome <span className="admin-name">{admin?.first_name || 'Admin'}</span></>
          ) : (
            'Admin Panel'
          )}
        </div>

        {/* Right actions - only show when authenticated */}
        {isAdminAuthenticated && (
          <div className="header-actions">
            <div className="dropdown-wrapper" ref={dropdownRef}>
              <button
                className="user-dropdown-btn"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {admin?.first_name || 'Admin'} <span className="dropdown-chevron">⌄</span>
              </button>

              {isOpen && (
                <div className="dropdown-menu">
                  <Link href="/admin/profile" className="dropdown-item">Profile</Link>
                  <Link href="/admin/brandDetails" className="dropdown-item">Brand Details</Link>
                  <Link href="/admin/profile/update-password" className="dropdown-item">Update Password</Link>
                  <button
                    onClick={logout}
                    className="dropdown-item logout-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}