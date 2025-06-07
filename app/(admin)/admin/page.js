'use client';

import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function LoginPage() {
  const router = useRouter();
  const { login, isAdminAuthenticated } = useAdmin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAdminAuthenticated) {
      router.push("/admin/dashbord");
    }
  }, [isAdminAuthenticated, router]);

  const onSubmit = async (data) => {
    try {
      // Use the login function from context which will handle all the state updates
      await login(data.email, data.password);
      toast.success("Login successful!");
      router.push("/admin/dashbord");
    } catch (err) {
      const errorMessage = err?.response?.data?.detail || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login-page-container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="login-form"
      >
        <h2 className="login-title">Admin Login</h2>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            {...register("email")}
            type="email"
            className={`form-input ${errors.email ? "input-error" : ""}`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            {...register("password")}
            type="password"
            className={`form-input ${errors.password ? "input-error" : ""}`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="button-loading">
              <span className="loading-spinner"></span>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}