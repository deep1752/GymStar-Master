"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { GiGymBag } from "react-icons/gi";
import { FaDumbbell, FaHeartbeat } from "react-icons/fa";
import { loadStripe } from '@stripe/stripe-js';

const runConfetti = () => {
  if (typeof window !== "undefined") {
    import("canvas-confetti").then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff'],
      });
      
      setTimeout(() => {
        confetti.default({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ffffff', '#4CAF50'],
        });
        confetti.default({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ffffff', '#2196F3'],
        });
      }, 300);
    });
  }
};

const SuccessPay = () => {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchSessionAndProcess = async () => {
      const session_id = searchParams.get("session_id");

      if (!session_id) {
        toast.error("Missing session ID.");
        setIsProcessing(false);
        return;
      }

      try {
        // Initialize Stripe properly
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        
        if (!stripe) {
          throw new Error("Stripe failed to initialize");
        }

        // Fetch the session from your backend instead of directly from Stripe
        const sessionResponse = await fetch(`/api/stripe/session?session_id=${session_id}`);
        const session = await sessionResponse.json();

        if (!session || session.error) {
          throw new Error(session?.error || "Failed to retrieve session");
        }

        // Validate session metadata exists
        if (!session.metadata) {
          toast.error("Session metadata is missing.");
          setIsProcessing(false);
          return;
        }

        const {
          user_id,
          membership_id,
          price,
          originalPrice,
          discount,
          final_price,
          plan_type,
          promocode,
        } = session.metadata;

        if (!user_id || !membership_id || !final_price || !plan_type) {
          toast.error("Missing subscription metadata.");
          setIsProcessing(false);
          return;
        }

        // Get user's previous subscriptions
        const prevSubResponse = await fetch(`http://127.0.0.1:8000/subscription/by_user/${user_id}`);
        const prevSubs = await prevSubResponse.json();

        let newStartDate = new Date();
        
        if (Array.isArray(prevSubs) && prevSubs.length > 0) {
          const latestSub = prevSubs.reduce((latest, current) => {
            return new Date(current.expiry_date) > new Date(latest.expiry_date) ? current : latest;
          });

          const latestExpiry = new Date(latestSub.expiry_date);
          if (latestExpiry > new Date()) {
            newStartDate = latestExpiry;
          }
        }

        const expiryDate = new Date(newStartDate);
        switch (plan_type) {
          case "monthly":
            expiryDate.setMonth(expiryDate.getMonth() + 1);
            break;
          case "half-yearly":
            expiryDate.setMonth(expiryDate.getMonth() + 6);
            break;
          case "yearly":
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            break;
          default:
            throw new Error("Invalid plan type");
        }

        const response = await fetch("http://127.0.0.1:8000/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id,
            membership_id,
            start_date: newStartDate.toISOString(),
            expiry_date: expiryDate.toISOString(),
            subtotal: parseFloat(originalPrice || price),
            discount: parseFloat(discount || 0),
            total: parseFloat(final_price),
            promocode,
            payment_status: "paid",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create subscription");
        }

        localStorage.removeItem("cart");
        toast.success("Payment successful! Subscription activated.");
        runConfetti();
        setIsSuccess(true);
      } catch (err) {
        console.error("Payment confirmation error:", err);
        toast.error(err.message || "Failed to verify payment.");
      } finally {
        setIsProcessing(false);
      }
    };

    fetchSessionAndProcess();
  }, [searchParams]);

  return (
    <div className="success-wrapper">
      <div className="small-container">
        <div className="success-content">
          <div className="icon-circle-small">
            <GiGymBag className="main-icon-small" />
            <FaDumbbell className="decor-icon-small dumbell-icon" />
            <FaHeartbeat className="decor-icon-small heart-icon" />
          </div>

          <h2 className="small-title">Welcome to GymStar Premium!</h2>
          <p className="small-subtitle">Your fitness transformation starts now</p>

          {isProcessing && (
            <>
              <div className="small-progress-bar">
                <div className="small-progress-fill animate-pulse"></div>
              </div>
              <p className="small-status-text">Activating your premium membership...</p>
            </>
          )}

          {!isProcessing && isSuccess && (
            <>
              <p className="text-green-600 font-semibold mt-4">
                Membership activated successfully!
              </p>
            </>
          )}

          <div className="small-benefits-box">
            <h4 className="small-benefits-title">Your Premium Benefits:</h4>
            <ul className="small-benefits-list">
              <li>Unlimited access to all gym facilities</li>
              <li>Personal training session</li>
              <li>Premium workout plans</li>
              <li>Nutrition guides</li>
            </ul>
          </div>

          <p className="small-support-text">
            Need help? <a href="mailto:support@gymstar.com">support@gymstar.com</a>
          </p>

          {!isProcessing && (
            <Link href="/subscription" className="small-cta-button">
              Go to Your Subscription
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPay;