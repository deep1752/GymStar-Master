"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Base URL for API requests
const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Subscription Page Component
 * Displays user's subscription history and current membership status
 */
const SubscriptionPage = () => {
  // Get user data and authentication token from context
  const { user, token } = useUser();
  const router = useRouter();
  
  // State for subscriptions data and loading status
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membershipPlans, setMembershipPlans] = useState({});

  // Fetch subscriptions when user or token changes
  useEffect(() => {
    if (!user || !token) {
      router.push('/join');
      return;
    }
    fetchSubscriptions();
  }, [user, token]);

  /**
   * Fetches user subscriptions and associated membership plans
   */
  const fetchSubscriptions = async () => {
    if (!user) return;

    try {
      // Get user subscriptions
      const res = await axios.get(`${API_BASE_URL}/subscription/by_user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort subscriptions by start date (newest first)
      const subscriptionsData = res.data || [];
      const sorted = subscriptionsData.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      setSubscriptions(sorted);

      // Get unique membership plan IDs from subscriptions
      const uniquePlanIds = [...new Set(subscriptionsData.map(sub => sub.membership_id))];
      
      // Fetch details for each membership plan
      const planRequests = uniquePlanIds.map(id =>
        axios.get(`${API_BASE_URL}/membership/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      // Process all plan requests
      const planResponses = await Promise.all(planRequests);
      const plans = {};
      planResponses.forEach((res) => {
        const plan = res.data;
        plans[plan.id] = plan.name; // Map plan ID to plan name
      });

      setMembershipPlans(plans);
    } catch (error) {
      // Handle errors
      if (error.response?.status === 404) {
        setSubscriptions([]); // No subscriptions found
      } else {
        toast.error("Failed to fetch subscription details");
        console.error("Subscription fetch error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Determines subscription status based on dates
   * @param {string} start - Start date string
   * @param {string} end - End date string
   * @returns {string} - Subscription status ('Active' or 'Expired')
   */
  const getSubscriptionStatus = (start, end) => {
    const now = new Date().getTime();
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    if (startDate > now) return 'Active'; // Future start date
    if (endDate < now) return 'Expired'; // Past end date
    return 'Active'; // Currently active
  };

  // Loading state
  if (loading) {
    return (
      <div className="subscription-loading-container">
        <Loader className="subscription-loading-icon animate-spin" />
        <span className="subscription-loading-text">Loading your subscriptions...</span>
      </div>
    );
  }

  // Empty state (no subscriptions)
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="subscription-empty-container">
        <div className="subscription-empty-card">
          <div className="motivation-icon">💪</div>
          <h2 className="subscription-empty-title">Your Fitness Journey Starts Here!</h2>
          <p className="subscription-empty-message">
            You don't have any active subscriptions yet. This is your chance to transform your life!
          </p>

          <div className="motivational-lines">
            <p>🔥 <strong>1,000+ members</strong> are already achieving their goals</p>
            <p>⭐ <strong>92% success rate</strong> with our proven training programs</p>
            <p>⏱️ <strong>Limited-time offer:</strong> Get 20% off your first 6 months</p>
          </div>

          <Link className="subscription-empty-button" href="/membership">
            Discover Your Perfect Plan
          </Link>

          <p className="subscription-empty-note">
            Join today and get <strong>free access</strong> to our starter workout program!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-page-container">
      {/* Hero Header Section */}
      <div className="container-fluid bg-primary p-5 bg-hero mb-5">
        <div className="row py-5">
          <div className="col-12 text-center">
            <h1 className="display-2 text-uppercase text-white mb-md-4">
              Your Subscription History
            </h1>
            <div className="d-flex justify-content-center gap-3">
              <a href="/" className="btn btn-primary py-md-3 px-md-5 btn-hero">
                Home
              </a>
              <Link className="btn btn-light py-md-3 px-md-5 btn-hero" href="/membership">
                Membership Plans
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="subscription-main-content">
        {/* Stats Summary Cards */}
        <div className="subscription-stats-grid">
          <div className="subscription-stat-card">
            <h3 className="subscription-stat-title">Total Subscriptions</h3>
            <p className="subscription-stat-value">{subscriptions.length}</p>
          </div>
          <div className="subscription-stat-card">
            <h3 className="subscription-stat-title">Active Subscriptions</h3>
            <p className="subscription-stat-value-active">
              {subscriptions.filter(sub => getSubscriptionStatus(sub.start_date, sub.expiry_date) === 'Active').length}
            </p>
          </div>
          <div className="subscription-stat-card">
            <h3 className="subscription-stat-title">Total Spent</h3>
            <p className="subscription-stat-value-total">
              ₹{subscriptions.reduce((sum, sub) => sum + sub.total, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Subscription Table */}
        <div className="subscription-table-container">
          <div className="subscription-table-wrapper">
            <table className="subscription-table">
              <thead className="subscription-table-header">
                <tr>
                  <th className="subscription-table-th">Subscription</th>
                  <th className="subscription-table-th">Plan Details</th>
                  <th className="subscription-table-th">Duration</th>
                  <th className="subscription-table-th">Payment</th>
                  <th className="subscription-table-th">Status</th>
                </tr>
              </thead>
              <tbody className="subscription-table-body">
                {subscriptions.map((sub) => {
                  const status = getSubscriptionStatus(sub.start_date, sub.expiry_date);

                  return (
                    <tr key={sub.id} className="subscription-table-row">
                      <td className="subscription-table-td">
                        <div className="subscription-id-container">
                          <div className="subscription-id-badge">
                            <span className="subscription-id-text">#{sub.id}</span>
                          </div>
                          <div className="subscription-info">
                            <div className="subscription-status-text">
                              {status} Subscription
                            </div>
                            <div className="subscription-date-text">
                              {new Date(sub.created_at).toLocaleString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'Asia/Kolkata'
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="subscription-table-td">
                        <div className="subscription-plan-text">
                          {membershipPlans[sub.membership_id] || `Plan #${sub.membership_id}`}
                        </div>
                        {sub.promocode && sub.promocode !== "Null" && (
                          <div className="subscription-promo-badge">
                            Promo: {sub.promocode}
                          </div>
                        )}
                      </td>
                      <td className="subscription-table-td">
                        <div className="subscription-duration-container">
                          <div>
                            <span className="subscription-duration-label">Start:</span>{' '}
                            {new Date(sub.start_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                          </div>
                          <div>
                            <span className="subscription-duration-label">End:</span>{' '}
                            {new Date(sub.expiry_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                          </div>
                        </div>
                      </td>
                      <td className="subscription-table-td">
                        <div className="subscription-payment-container">
                          <div>
                            <span className="subscription-payment-label">Subtotal:</span>{' '}
                            ₹{sub.subtotal.toLocaleString()}
                          </div>
                          <div>
                            <span className="subscription-payment-label">Discount:</span>{' '}
                            {sub.discount.toLocaleString()}%
                          </div>
                          <div className="subscription-total-text">
                            <span className="subscription-payment-label">Total Paid:</span>{' '}
                            ₹{sub.total.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="subscription-table-td">
                        <div className="subscription-status-container">
                          <span className={`subscription-payment-status ${sub.payment_status === 'paid' ? 'paid' : 'unpaid'}`}>
                            {sub.payment_status.toUpperCase()}
                          </span>
                          <span className={`subscription-active-status ${status === 'Active' ? 'active' : 'expired'}`}>
                            {status.toUpperCase()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Section */}
        <div className="subscription-help-section">
          <h2 className="subscription-help-title">Need help with your subscriptions?</h2>
          <p className="subscription-help-text">
            If you have any questions about your subscriptions or need assistance, our support team is here to help.
          </p>
          <div className="subscription-help-buttons">
            <Link className="subscription-help-button-primary" href="/contact">Contact Support</Link>
            <Link className="subscription-help-button-secondary" href="/team">Meet Our Trainers</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;