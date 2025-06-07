'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

/**
 * Join Us Page Component
 * Handles new user registration with form validation
 */
export default function JoinUsPage() {
  // Get user registration function and state from context
  const { register: registerUser, loading, user } = useUser();
  const router = useRouter();
  
  // State for success/error messages
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Redirect to profile if user is already logged in
   */
  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  // Form handling with react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  /**
   * Handles form submission
   * @param {Object} data - Form data containing user registration details
   */
  const onSubmit = async (data) => {
    // Clear any existing messages
    setErrorMsg('');
    setSuccessMsg('');

    // Remove confirm_password field and convert age to number
    const { confirm_password, ...userData } = data;
    userData.age = parseInt(userData.age, 10);

    // Attempt registration using context method
    const res = await registerUser(userData);
    
    if (res.success) {
      // Handle successful registration
      setSuccessMsg('Registration successful! Redirecting to login...');
      reset(); // Clear form fields

      // Redirect to login after delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      // Display error message if registration fails
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

          {/* Social Sharing Buttons */}
          <div className="mt-3">
            <a href="https://facebook.com/yourusername" className="btn btn-outline-primary me-2">
              Share on Facebook
            </a>
            <a href="https://twitter.com/yourusername" className="btn btn-outline-info">
              Share on Twitter
            </a>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="col-md-6">
          <h2 className="mb-4">Join Us</h2>
          
          {/* Display error/success messages */}
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Fields (First and Last) */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  {...register('first_name', { required: 'First name is required' })}
                  placeholder="First Name"
                  className="form-control"
                />
                {errors.first_name && <p className="text-danger">{errors.first_name.message}</p>}
              </div>
              <div className="col-md-6 mb-3">
                <input
                  {...register('last_name', { required: 'Last name is required' })}
                  placeholder="Last Name"
                  className="form-control"
                />
                {errors.last_name && <p className="text-danger">{errors.last_name.message}</p>}
              </div>
            </div>

            {/* Email Field */}
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
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>

            {/* Password Fields */}
            <div className="row">
              <div className="col-md-6 mb-3">
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
                {errors.password && <p className="text-danger">{errors.password.message}</p>}
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="password"
                  {...register('confirm_password', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === watch('password') || 'Passwords do not match',
                  })}
                  placeholder="Confirm Password"
                  className="form-control"
                />
                {errors.confirm_password && <p className="text-danger">{errors.confirm_password.message}</p>}
              </div>
            </div>

            {/* Mobile Number Field */}
            <div className="mb-3">
              <input
                type="text"
                maxLength="10"
                {...register('mobile', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Mobile number must be exactly 10 digits',
                  },
                  minLength: {
                    value: 10,
                    message: 'Mobile number must be exactly 10 digits',
                  },
                  maxLength: {
                    value: 10,
                    message: 'Mobile number must be exactly 10 digits',
                  },
                })}
                placeholder="Mobile"
                className="form-control"
              />
              {errors.mobile && <p className="text-danger">{errors.mobile.message}</p>}
            </div>

            {/* Age and Gender Fields */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="number"
                  {...register('age', {
                    required: 'Age is required',
                    min: { value: 1, message: 'Enter a valid age' },
                    max: { value: 100, message: 'Age must be 100 or below' },
                  })}
                  placeholder="Age"
                  className="form-control"
                  onInput={(e) => {
                    // Client-side validation for age input
                    if (e.target.value.length > 3) e.target.value = e.target.value.slice(0, 3);
                    if (parseInt(e.target.value) > 100) e.target.value = '100';
                  }}
                />
                {errors.age && <p className="text-danger">{errors.age.message}</p>}
              </div>
              <div className="col-md-6 mb-3">
                <select
                  {...register('gender', { required: 'Please select your gender' })}
                  className="form-select"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-danger">{errors.gender.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-100" 
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

            {/* Login Link */}
            <div className="text-center mt-3">
              Already have an account?{' '}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => router.push('/login')}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}