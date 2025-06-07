'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useUser } from '../context/UserContext'; // adjust path if needed
import { usePathname } from 'next/navigation';


const Header = () => {
  const { user, logout } = useUser();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();


  // Hardcoded for now. Later this could come from auth or config.
  const adminId = 1;

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/admin/get_by_id/${adminId}`);
        setAdmin(response.data);
      } catch (error) {
        console.error("Failed to fetch admin details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId]);

  if (loading || !admin) {
    return null; // Or a loader if desired
  }

  return (
    <header className="sticky-header">
      <div className="container-fluid bg-dark px-0">
        <div className="row gx-0">
          <div className="col-lg-3 bg-dark d-none d-lg-block">
            <Link
              href="/"
              className="navbar-brand w-100 h-100 m-0 p-0 d-flex align-items-center justify-content-center"
            >
              <h1 className="m-0 display-4 text-primary text-uppercase">
                {admin.brand_name || "Gymstar"}
              </h1>
            </Link>
          </div>
          <div className="col-lg-9">
            <div className="row gx-0 bg-secondary d-none d-lg-flex">
              <div className="col-lg-7 px-5 text-start">
                <div className="h-100 d-inline-flex align-items-center py-2 me-4">
                  <i className="fa fa-envelope text-primary me-2" />
                  <h6 className="mb-0">{admin.email}</h6>
                </div>
                <div className="h-100 d-inline-flex align-items-center py-2">
                  <i className="fa fa-phone-alt text-primary me-2" />
                  <h6 className="mb-0">{admin.mobile_number}</h6>
                </div>
              </div>
              <div className="col-lg-5 px-5 text-end">
                <div className="d-inline-flex align-items-center py-2">
                  {admin.fb_link && (
                    <a className="btn btn-light btn-square rounded-circle me-2" href={`https://${admin.fb_link}`} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-facebook-f" />
                    </a>
                  )}
                  {admin.twiter_link && (
                    <a className="btn btn-light btn-square rounded-circle me-2" href={`https://${admin.twiter_link}`} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-twitter" />
                    </a>
                  )}
                  {admin.linkedin_link && (
                    <a className="btn btn-light btn-square rounded-circle me-2" href={`https://${admin.linkedin_link}`} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-linkedin-in" />
                    </a>
                  )}
                  {admin.insta_link && (
                    <a className="btn btn-light btn-square rounded-circle me-2" href={`https://${admin.insta_link}`} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-instagram" />
                    </a>
                  )}
                  {admin.youtube_link && (
                    <a className="btn btn-light btn-square rounded-circle" href={`https://${admin.youtube_link}`} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-youtube" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <nav className="navbar navbar-expand-lg bg-dark navbar-dark p-3 p-lg-0 px-lg-5">
              <Link href="/" className="navbar-brand d-block d-lg-none">
                <h1 className="m-0 display-4 text-primary text-uppercase">
                  {admin.brand_name || "Gymstar"}
                </h1>
              </Link>
              <button
                type="button"
                className="navbar-toggler"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                <ul className="navbar-nav mr-auto py-0">
                  <li className="nav-item">
                    <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/class" className={`nav-link ${pathname === '/class' ? 'active' : ''}`}>Classes</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/team" className={`nav-link ${pathname === '/team' ? 'active' : ''}`}>Trainers</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/membership" className={`nav-link ${pathname === '/membership' ? 'active' : ''}`}>Membership</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
                  </li>
                </ul>


                {user ? (
                  <div className="dropdown">
                    <button
                      className="btn btn-primary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {user.first_name || "User"}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link className="dropdown-item" href="/profile">Profile</Link></li>
                      <li><Link className="dropdown-item" href="/subscription">Subscription</Link></li>
                      <li><Link className="dropdown-item" href="/profile/change-password">Change Password</Link></li>
                      <li><button className="dropdown-item text-danger" onClick={logout}>Logout</button></li>
                    </ul>
                  </div>
                ) : (
                  <Link href="/join" className="btn btn-primary py-md-3 px-md-5 d-none d-lg-block">
                    Join Us
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
