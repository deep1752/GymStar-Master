"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "sonner";

export default function GymAdminDashboard () {
  // State for all data
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customDays, setCustomDays] = useState('');
  const [customRevenue, setCustomRevenue] = useState(null);
  const [dateRangeError, setDateRangeError] = useState('');

  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [dateRangeRevenue, setDateRangeRevenue] = useState(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersRes,
          membershipsRes,
          subscriptionsRes,
          slidersRes,
          trainersRes,
          classesRes
        ] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/membership/get_all`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subscription/`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/slider/get`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trainer/get_all`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/classes/get_all`)
        ]);

        setUsers(usersRes.data);
        setMemberships(membershipsRes.data);
        setSubscriptions(subscriptionsRes.data);
        setSliders(slidersRes.data);
        setTrainers(trainersRes.data);
        setClasses(classesRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalCustomers = users.filter(user => user.role === 'customer').length;
  const maleCustomers = users.filter(user => user.gender === 'Male' && user.role === 'customer').length;
  const femaleCustomers = users.filter(user => user.gender === 'Female' && user.role === 'customer').length;

  const totalMemberships = memberships.length;
  const activeMemberships = memberships.filter(m => m.status === 'active').length;
  const inactiveMemberships = memberships.filter(m => m.status !== 'active').length;

  const totalSubscriptions = subscriptions.length;
  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.total, 0);

  // Current date is May 2025 (as per your example)
  const today = new Date(); // May 2025
  const tenDaysAgo = new Date(today);
  tenDaysAgo.setDate(today.getDate() - 10);

  // Last month (April 1 to April 30)
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month

  // Last 3 months (February 1 to April 30)
  const last3MonthsStart = new Date(today.getFullYear(), today.getMonth() - 3, 1);
  const last3MonthsEnd = lastMonthEnd; // Same as last month end

  // Last 6 months (November 1, 2024 to April 30, 2025)
  const last6MonthsStart = new Date(today.getFullYear(), today.getMonth() - 6, 1);
  const last6MonthsEnd = lastMonthEnd; // Same as last month end

  // Last financial year (April 1, 2024 to March 31, 2025)
  const lastFinancialYearStart = new Date(today.getFullYear() - 1, 3, 1); // April 1, 2024
  const lastFinancialYearEnd = new Date(today.getFullYear(), 2, 31); // March 31, 2025

  // This financial year (April 1 to current date)
  const thisFinancialYearStart = new Date(today.getFullYear(), 3, 1); // April 1, 2025
  const thisFinancialYearEnd = today; // Current date

  // This month (May 1 to current date)
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const todayRevenue = subscriptions
    .filter(sub => {
      const subDate = new Date(sub.created_at);
      return subDate >= startOfToday && subDate < endOfToday;
    })
    .reduce((sum, sub) => sum + sub.total, 0);

  // Revenue calculations
  const last10DaysRevenue = subscriptions
    .filter(sub => new Date(sub.created_at) >= tenDaysAgo)
    .reduce((sum, sub) => sum + sub.total, 0);

  const lastMonthRevenue = subscriptions
    .filter(sub => {
      const subDate = new Date(sub.created_at);
      return subDate >= lastMonthStart && subDate <= lastMonthEnd;
    })
    .reduce((sum, sub) => sum + sub.total, 0);

  const last3MonthsRevenue = subscriptions
    .filter(sub => {
      const subDate = new Date(sub.created_at);
      return subDate >= last3MonthsStart && subDate <= last3MonthsEnd;
    })
    .reduce((sum, sub) => sum + sub.total, 0);

  const last6MonthsRevenue = subscriptions
    .filter(sub => {
      const subDate = new Date(sub.created_at);
      return subDate >= last6MonthsStart && subDate <= last6MonthsEnd;
    })
    .reduce((sum, sub) => sum + sub.total, 0);

  const lastYearRevenue = subscriptions
    .filter(sub => {
      const subDate = new Date(sub.created_at);
      return subDate >= lastFinancialYearStart && subDate <= lastFinancialYearEnd;
    })
    .reduce((sum, sub) => sum + sub.total, 0);

  const thisYearRevenue = subscriptions
    .filter(sub => {
      const subDate = new Date(sub.created_at);
      return subDate >= thisFinancialYearStart && subDate <= thisFinancialYearEnd;
    })
    .reduce((sum, sub) => sum + sub.total, 0);

  const thisMonthRevenue = subscriptions
    .filter(sub => {
      const subDate = new Date(sub.created_at);
      return subDate >= thisMonthStart && subDate <= today;
    })
    .reduce((sum, sub) => sum + sub.total, 0);

  const totalTrainers = trainers.length;

  const totalSliders = sliders.length;
  const activeSliders = sliders.filter(s => s.status === 'active').length;
  const inactiveSliders = sliders.filter(s => s.status !== 'active').length;

  // Group classes by day
  const classesByDay = classes.reduce((acc, cls) => {
    const day = cls.day;
    if (!acc[day]) {
      acc[day] = 0;
    }
    acc[day]++;
    return acc;
  }, {});

  const totalClasses = classes.length;

  // Calculate custom days revenue
  const calculateCustomDaysRevenue = () => {
    const days = parseInt(customDays);

    // Validation 1: Check for NaN
    if (isNaN(days)) {
      toast.error("⚠️ Please enter a valid number.");
      return;
    }

    // Validation 2: Days must be 1 or more
    if (days < 1) {
      toast.error("⚠️ Number of days must be at least 1.");
      return;
    }

    const customDate = new Date(today);
    customDate.setDate(today.getDate() - days);

    const revenue = subscriptions
      .filter(sub => new Date(sub.created_at) >= customDate)
      .reduce((sum, sub) => sum + sub.total, 0);

    setCustomRevenue(revenue);
  };

  const calculateDateRangeRevenue = () => {
    if (!dateRange.start || !dateRange.end) return;

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const today = new Date();

    // Validation 1: End date must be after start date
    if (endDate <= startDate) {
      toast.error("⚠️ End date must be after start date.");
      setDateRangeRevenue(null);
      return;
    }

    // Validation 2: End date must not be in the future
    if (endDate > today) {
      toast.error("⚠️ End date cannot be in the future.");
      setDateRangeRevenue(null);
      return;
    }

    const revenue = subscriptions
      .filter(sub => {
        const subDate = new Date(sub.created_at);
        return subDate >= startDate && subDate <= endDate;
      })
      .reduce((sum, sub) => sum + sub.total, 0);

    setDateRangeRevenue(revenue);
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">GymStar Admin Dashboard</h1>

      <div className="dashboard-controls">
        {/* Custom Revenue Calculations */}
        <div className="revenue-calculator">
          <div className="calculator-card">
            <h3 className="calculator-title">Custom Days Revenue</h3>
            <div className="calculator-input-group">
              <input
                type="number"
                min="1"
                value={customDays}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || parseInt(value) >= 1) {
                    setCustomDays(value);
                  }
                }}
                placeholder="Enter number of days"
                className="calculator-input"
              />
              <button 
                onClick={calculateCustomDaysRevenue}
                className="calculator-button"
              >
                Calculate
              </button>
            </div>
            {customRevenue !== null && (
              <p className="calculator-result">
                Revenue for last {customDays} days: <span className="revenue-amount">₹{customRevenue.toFixed(2)}</span>
              </p>
            )}
          </div>

          <div className="calculator-card">
            <h3 className="calculator-title">Date Range Revenue</h3>
            <div className="date-range-group">
              <div className="date-range-input">
                <label className="date-range-label">Start Date:</label>
                <input
                  type="date"
                  value={dateRange.start}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="date-input"
                />
              </div>
              <div className="date-range-input">
                <label className="date-range-label">End Date:</label>
                <input
                  type="date"
                  value={dateRange.end}
                  min={dateRange.start || undefined}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="date-input"
                />
              </div>
            </div>
            {dateRangeError && <p className="error-message">{dateRangeError}</p>}
            <button 
              onClick={calculateDateRangeRevenue}
              className="calculator-button"
            >
              Calculate
            </button>
            {dateRangeRevenue !== null && (
              <p className="calculator-result">
                Revenue from {dateRange.start} to {dateRange.end}: 
                <span className="revenue-amount"> ₹{dateRangeRevenue.toFixed(2)}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {/* Revenue Breakdown */}
        <div className="stat-card revenue-card">
          <h3 className="stat-title">Revenue Breakdown</h3>
          <div className="stat-item">
            <span className="stat-label">Today:</span>
            <span className="stat-value">₹{todayRevenue.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Last 10 Days:</span>
            <span className="stat-value">₹{last10DaysRevenue.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">This Month :</span>
            <span className="stat-value">₹{thisMonthRevenue.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Last Month :</span>
            <span className="stat-value">₹{lastMonthRevenue.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Last 3 Months:</span>
            <span className="stat-value">₹{last3MonthsRevenue.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Last 6 Months:</span>
            <span className="stat-value">₹{last6MonthsRevenue.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">This Year (Financial Year):</span>
            <span className="stat-value">₹{thisYearRevenue.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Last Year (Financial Year):</span>
            <span className="stat-value">₹{lastYearRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* Subscription Stats */}
        <div className="stat-card">
          <h3 className="stat-title">Subscriptions</h3>
          <div className="stat-item">
            <span className="stat-label">Total Subscriptions:</span>
            <span className="stat-value">{totalSubscriptions}</span>
          </div>
          <div className="stat-item highlight">
            <span className="stat-label">Total Revenue:</span>
            <span className="stat-value">₹{totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* Users Stats */}
        <div className="stat-card">
          <h3 className="stat-title">Users</h3>
          <div className="stat-item">
            <span className="stat-label">Total Customers:</span>
            <span className="stat-value">{totalCustomers}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Male Customers:</span>
            <span className="stat-value">{maleCustomers}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Female Customers:</span>
            <span className="stat-value">{femaleCustomers}</span>
          </div>
        </div>

        {/* Membership Stats */}
        <div className="stat-card">
          <h3 className="stat-title">Membership Plans</h3>
          <div className="stat-item">
            <span className="stat-label">Total Plans:</span>
            <span className="stat-value">{totalMemberships}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active Plans:</span>
            <span className="stat-value active">{activeMemberships}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Inactive Plans:</span>
            <span className="stat-value inactive">{inactiveMemberships}</span>
          </div>
        </div>

        {/* Trainers */}
        <div className="stat-card">
          <h3 className="stat-title">Trainers</h3>
          <div className="stat-item">
            <span className="stat-label">Total Trainers:</span>
            <span className="stat-value">{totalTrainers}</span>
          </div>
        </div>

        {/* Classes */}
        <div className="stat-card">
          <h3 className="stat-title">Classes</h3>
          <div className="stat-item">
            <span className="stat-label">Total Classes:</span>
            <span className="stat-value">{totalClasses}</span>
          </div>
          {Object.entries(classesByDay).map(([day, count]) => (
            <div className="stat-item" key={day}>
              <span className="stat-label">{day}:</span>
              <span className="stat-value">{count}</span>
            </div>
          ))}
        </div>

        {/* Sliders */}
        <div className="stat-card">
          <h3 className="stat-title">Sliders</h3>
          <div className="stat-item">
            <span className="stat-label">Total Sliders:</span>
            <span className="stat-value">{totalSliders}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active Sliders:</span>
            <span className="stat-value active">{activeSliders}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Inactive Sliders:</span>
            <span className="stat-value inactive">{inactiveSliders}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

