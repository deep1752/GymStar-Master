"use client";

import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ message: '', type: '' });
        
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/`, formData);
            setAlert({
                message: 'Message sent successfully! We will get back to you soon.',
                type: 'success'
            });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 
                               'Error sending message. Please try again later.';
            setAlert({
                message: errorMessage,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Hero Start */}
            <div className="container-fluid bg-primary p-5 bg-hero mb-5">
                <div className="row py-5">
                    <div className="col-12 text-center">
                        <h1 className="display-2 text-uppercase text-white mb-md-4">Contact</h1>
                        <Link className="btn btn-primary py-md-3 px-md-5 me-3" href="/">Home</Link>
                        <Link className="btn btn-light py-md-3 px-md-5" href="about">About Us</Link>
                    </div>
                </div>
            </div>
            {/* Hero End */}
            
            <div className="container-fluid p-5">
                <div className="row g-0">
                    <div className="col-lg-6">
                        <div className="bg-dark p-5">
                            {alert.message && (
                                <div className={`alert alert-${alert.type === 'success' ? 'success' : 'danger'} mb-4`}>
                                    {alert.message}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <input
                                            name="name"
                                            type="text"
                                            className="form-control bg-light border-0 px-4"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={{ height: 55 }}
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input
                                            name="email"
                                            type="email"
                                            className="form-control bg-light border-0 px-4"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={{ height: 55 }}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <input
                                            name="subject"
                                            type="text"
                                            className="form-control bg-light border-0 px-4"
                                            placeholder="Subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            style={{ height: 55 }}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <textarea
                                            name="message"
                                            className="form-control bg-light border-0 px-4 py-3"
                                            rows={4}
                                            placeholder="Message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <button 
                                            className="btn btn-primary w-100 py-3" 
                                            type="submit" 
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Sending...
                                                </>
                                            ) : 'Send Message'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <iframe
                            className="w-100"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                            frameBorder={0}
                            style={{ height: 457, border: 0 }}
                            allowFullScreen=""
                            aria-hidden="false"
                            tabIndex={0}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;



