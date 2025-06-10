'use client'; // if using Next.js App Router
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Footer = () => {
  const [admin, setAdmin] = useState(null);
  const adminId = 1

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get_by_id/${adminId}`);
        setAdmin(res.data);
      } catch (error) {
        console.error("Failed to fetch admin data");
      }
    };

    fetchAdmin();
  }, [adminId]);

  if (!admin) {
    return <footer className="footer text-center text-secondary py-5">Loading footer...</footer>;
  }

  return (
    <footer className="footer">
      <div className="container-fluid bg-dark text-secondary px-5 mt-5">
        <div className="row gx-5">
          <div className="col-lg-8 col-md-6">
            <div className="row gx-5">
              <div className="col-lg-4 col-md-12 pt-5 mb-5">
                <h4 className="text-uppercase text-light mb-4">Get In Touch</h4>
                <div className="d-flex mb-2">
                  <i className="bi bi-geo-alt text-primary me-2" />
                  <p className="mb-0">{admin.address}</p>
                </div>
                <div className="d-flex mb-2">
                  <i className="bi bi-envelope-open text-primary me-2" />
                  <p className="mb-0">{admin.email}</p>
                </div>
                <div className="d-flex mb-2">
                  <i className="bi bi-telephone text-primary me-2" />
                  <p className="mb-0">{admin.mobile_number}</p>
                </div>
                <div className="d-flex mt-4">
                  {admin.twiter_link && (
                    <a className="btn btn-primary btn-square rounded-circle me-2" href={`https://${admin.twiter_link}`} target="_blank" rel="noreferrer">
                      <i className="fab fa-twitter" />
                    </a>
                  )}
                  {admin.fb_link && (
                    <a className="btn btn-primary btn-square rounded-circle me-2" href={`https://${admin.fb_link}`} target="_blank" rel="noreferrer">
                      <i className="fab fa-facebook-f" />
                    </a>
                  )}
                  {admin.linkedin_link && (
                    <a className="btn btn-primary btn-square rounded-circle me-2" href={`https://${admin.linkedin_link}`} target="_blank" rel="noreferrer">
                      <i className="fab fa-linkedin-in" />
                    </a>
                  )}
                  {admin.insta_link && (
                    <a className="btn btn-primary btn-square rounded-circle" href={`https://${admin.insta_link}`} target="_blank" rel="noreferrer">
                      <i className="fab fa-instagram" />
                    </a>
                  )}
                </div>
              </div>

              {/* Keep the rest static as in your original */}
              <div className="col-lg-4 col-md-12 pt-0 pt-lg-5 mb-5">
                <h4 className="text-uppercase text-light mb-4">Quick Links</h4>
                <div className="d-flex flex-column justify-content-start">
                  <Link href="/" className="text-secondary mb-2">
                    <i className="bi bi-arrow-right text-primary me-2" />
                    Home
                  </Link>
                  <Link href="/about" className="text-secondary mb-2">
                    <i className="bi bi-arrow-right text-primary me-2" />
                    About Us
                  </Link>
                  <Link href="/class" className="text-secondary mb-2">
                    <i className="bi bi-arrow-right text-primary me-2" />
                    Class Schedule
                  </Link>
                  <Link href="/team" className="text-secondary mb-2">
                    <i className="bi bi-arrow-right text-primary me-2" />
                    Our Trainers
                  </Link>
                  <Link href="/blog" className="text-secondary mb-2">
                    <i className="bi bi-arrow-right text-primary me-2" />
                    Latest Blog
                  </Link>
                  <Link href="/contact" className="text-secondary">
                    <i className="bi bi-arrow-right text-primary me-2" />
                    Contact Us
                  </Link>
                </div>
              </div>

              <div className="col-lg-4 col-md-12 pt-0 pt-lg-5 mb-5">
                <h4 className="text-uppercase text-light mb-4">Popular Links</h4>
                <div className="d-flex flex-column justify-content-start">
                  <Link href="/membership" className="text-secondary mb-2">
                    <i className="bi bi-arrow-right text-primary me-2" />
                    Membership Plans
                  </Link>
                  <Link href="/subscription" className="text-secondary mb-2">
                    <i className="bi bi-arrow-right text-primary me-2" />
                    Your Subscriptions
                  </Link>
                  <Link href="/join" className="text-secondary">
                    <i className="bi bi-arrow-right text-primary me-2" />
                    Join Us
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right box with CTA */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex flex-column align-items-center justify-content-center text-center h-100 bg-primary p-5">
              <h4 className="text-uppercase text-white mb-4">{admin.brand_name || 'GymStar'}</h4>
              <Link className="btn btn-light py-md-3 px-md-5 btn-hero" href="/membership">
                Get your Subscribe
              </Link>
              <p className="text-light mt-3">
                Welcome to {admin.brand_name || 'GymStar'} – Where Strength Meets Dedication!
              </p>
              <Link className="btn btn-dark" href="/contact">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4 py-lg-0 px-5" style={{ background: "#111111" }}>
        <div className="row gx-5">
          <div className="col-lg-8">
            <div className="py-lg-4 text-center">
              <p className="text-secondary mb-0">
                © <span className="text-light fw-bold">{admin.brand_name || 'GymStar'}</span>. All Rights Reserved.
              </p>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="py-lg-4 text-center credit">
              <p className="text-light mb-0">
                Designed by{" "}
                <a className="text-light fw-bold" href="https://newtechskills.in/">
                  NTS Academy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
