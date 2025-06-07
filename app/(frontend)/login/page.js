'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useForm } from 'react-hook-form';

/**
 * Login Page Component
 * Handles user authentication and provides login form
 */
const LoginPage = () => {
  // Initialize router for navigation
  const router = useRouter();
  
  // Get user context methods and state
  const { login, user, loading } = useUser();

  // State for success/error messages
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Redirect to home if user is already logged in
   */
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // Initialize form handling with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /**
   * Handles form submission
   * @param {Object} data - Form data containing email and password
   */
  const onSubmit = async (data) => {
    // Clear any existing messages
    setErrorMsg('');
    setSuccessMsg('');

    // Attempt login using context method
    const res = await login(data);
    
    if (res.success) {
      // Handle successful login
      setSuccessMsg('Login successful! Redirecting...');
      reset(); // Clear form fields

      // Redirect to home after delay
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } else {
      // Display error message if login fails
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Left Column: Club Facilities Information */}
        <div className="col-md-6 mb-4">
          <h2 className="mb-4">CLUB FACILITIES</h2>
          
          {/* Facilities List */}
          <ul className="list-group mb-4">
            {[
              'Group Exercise', 'Gym Floor', 'Cardio Area', 'Cycle Studio',
              'Free Weights', 'freestyle', 'Internet Station', 'Shower Area',
              'Steam Room', 'Strength Area', 'Personal Training', 'Towel Service',
              'F&B', 'Members Lounge', 'Yoga',
            ].map((item) => (
              <li key={item} className="list-group-item">✔️ {item}</li>
            ))}
          </ul>
          
          {/* Additional Information Sections */}
          <h5 className="fw-bold">TRY FREESTYLE™</h5>
          <p>
            Our dedicated Freestyle™ areas and fitness experts can help you discover 
            new training techniques and exercises that offer a dynamic and efficient 
            full-body workout.
          </p>
          
          <h5 className="fw-bold">TRY A CLASS</h5>
          <p>
            Come into any of your club and see how our range of group exercise classes 
            can take your fitness further. Why not sample yoga, spinning or circuit training.
          </p>
        </div>

        {/* Right Column: Login Form */}
        <div className="col-md-6">
          <h2 className="mb-4">Login</h2>
          
          {/* Display error/success messages */}
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input Field */}
            <div className="mb-3">
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                placeholder="Email"
                className="form-control"
              />
              {/* Display email validation errors */}
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>

            {/* Password Input Field */}
            <div className="mb-3">
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                placeholder="Password"
                className="form-control"
              />
              {/* Display password validation errors */}
              {errors.password && <p className="text-danger">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-100" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;