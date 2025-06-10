"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import getStripe from '@/lib/getStripe';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Determines the plan type based on duration days
 * @param {string} duration - Plan duration in days
 * @returns {string} - Plan type (monthly, half-yearly, yearly, or custom)
 */
const getPlanType = (duration) => {
    if (duration.includes("30")) return "monthly";
    if (duration.includes("182")) return "half-yearly";
    if (duration.includes("365")) return "yearly";
    return "custom";
};

/**
 * Formats a date string to a human-readable format
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date (e.g., "January 1, 2023")
 */
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Main Membership Page Component
 * Displays all available membership plans and handles subscriptions
 */
const MembershipPage = () => {
    // Context and state management
    const { user } = useUser();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userSubscriptions, setUserSubscriptions] = useState([]);
    const router = useRouter();

    /**
     * Fetches all necessary data when component mounts or user changes
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch all active membership plans
                const plansResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/membership/get_all`);
                const activePlans = plansResponse.data.filter(plan => plan.status === "active");

                // 2. Fetch user subscriptions if logged in
                let subscriptions = [];
                if (user?.id) {
                    try {
                        const subsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subscription/by_user/${user.id}`);
                        subscriptions = subsResponse.data;
                    } catch (subsError) {
                        if (subsError.response?.status === 404) {
                            subscriptions = [];
                        } else {
                            console.error("Error fetching user subscriptions:", subsError);
                        }
                    }
                }
                setUserSubscriptions(subscriptions);

                // 3. Enrich each plan with its additional info
                const enrichedPlans = await Promise.all(activePlans.map(async (plan) => {
                    try {
                        const infoRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/planInfo/get_by_membership_id/${plan.id}`);
                        const planInfo = infoRes.data[0];
                        return { ...plan, planInfo };
                    } catch (infoErr) {
                        console.error(`Error fetching plan info for ID ${plan.id}:`, infoErr);
                        return { ...plan, planInfo: null };
                    }
                }));

                setPlans(enrichedPlans);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    /**
     * Handles subscription button click
     * @param {object} plan - The membership plan to subscribe to
     */
    const handleSubscribe = async (plan) => {
        // Redirect to login if not authenticated
        if (!user) {
            router.push('/join');
            return;
        }

        try {
            const currentSub = getCurrentSubscription(plan.id);
            const isExtending = currentSub !== null;

            // Create Stripe checkout session
            const res = await fetch("/api/stripe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planName: plan.name,
                    price: plan.price,
                    originalPrice: plan.price / (1 - plan.discount / 100),
                    discount: plan.discount,
                    final_price: plan.final_price,
                    membership_id: plan.id,
                    plan_type: getPlanType(plan.duration),
                    promocode: "Null",
                    user_id: user.id,
                    mode: isExtending ? "extend" : "new",
                    current_expiry: currentSub?.expiry_date
                }),
            });

            const data = await res.json();
            if (data.id) {
                const stripe = await getStripe();
                stripe.redirectToCheckout({ sessionId: data.id });
            } else {
                alert("Payment session creation failed.");
            }
        } catch (err) {
            console.error("Stripe error:", err);
            alert("Payment error. Please try again.");
        }
    };

    // Helper functions for subscription status checks
    const isCurrentPlan = (planId) => {
        if (!user?.id || userSubscriptions.length === 0) return false;
        const now = new Date();
        return userSubscriptions.some(sub =>
            sub.membership_id === planId &&
            new Date(sub.expiry_date) > now
        );
    };

    const getCurrentSubscription = (planId) => {
        if (!user?.id || userSubscriptions.length === 0) return null;
        const now = new Date();
        const currentSubs = userSubscriptions
            .filter(sub => sub.membership_id === planId && new Date(sub.expiry_date) > now)
            .sort((a, b) => new Date(b.expiry_date) - new Date(a.expiry_date));
        return currentSubs.length > 0 ? currentSubs[0] : null;
    };

    const isExtended = (planId) => {
        if (!user?.id || userSubscriptions.length === 0) return false;
        const now = new Date();
        const activeSubs = userSubscriptions.filter(sub =>
            sub.membership_id === planId &&
            new Date(sub.expiry_date) > now &&
            sub.is_extended === true
        );
        return activeSubs.length > 0;
    };

    const hasActiveSubscription = () => {
        if (!user?.id || userSubscriptions.length === 0) return false;
        const now = new Date();
        return userSubscriptions.some(sub => new Date(sub.expiry_date) > now);
    };

    const hasTwoOrMoreActiveSubscriptions = () => {
        if (!user?.id || userSubscriptions.length < 2) return false;
        const now = new Date();
        const activeSubs = userSubscriptions.filter(sub => new Date(sub.expiry_date) > now);
        return activeSubs.length >= 2;
    };

    /**
     * Gets the highest priced active plan the user has
     * @returns {object|null} - The highest priced active plan or null if none
     */
    const getHighestPricedActivePlan = () => {
        if (!user?.id || userSubscriptions.length === 0) return null;
        const now = new Date();
        const activeSubs = userSubscriptions.filter(sub => new Date(sub.expiry_date) > now);

        if (activeSubs.length === 0) return null;

        // Find the corresponding plans for active subscriptions
        const activePlans = activeSubs.map(sub =>
            plans.find(plan => plan.id === sub.membership_id)
        ).filter(Boolean);

        if (activePlans.length === 0) return null;

        // Return the plan with highest final_price
        return activePlans.reduce((max, plan) =>
            plan.final_price > max.final_price ? plan : max, activePlans[0]);
    };

    /**
     * Determines the state/type of button to display for a plan
     * @param {object} plan - The membership plan
     * @returns {string} - Button state (current, extended, upgrade, get, or maxed)
     */
    const getButtonState = (plan) => {
        const currentSub = getCurrentSubscription(plan.id);
        const isCurrent = currentSub !== null;
        const isExtendedPlan = isExtended(plan.id);
        const hasActiveSub = hasActiveSubscription();
        const hasTooManySubs = hasTwoOrMoreActiveSubscriptions();
        const highestPricedPlan = getHighestPricedActivePlan();

        if (isCurrent) {
            if (isExtendedPlan) {
                return 'extended';
            }
            return 'current';
        } else if (hasActiveSub) {
            if (hasTooManySubs) {
                return 'maxed';
            }
            // Compare with highest priced active plan
            if (highestPricedPlan && plan.final_price > highestPricedPlan.final_price) {
                return 'upgrade';
            }
            return 'get';
        }
        return hasTooManySubs ? 'maxed' : 'get';
    };

    // Loading state
    if (loading) return <div className="membership-loading">Loading...</div>;

    return (
        <>
            {/* Hero Header Section */}
            <div className="container-fluid bg-primary p-5 bg-hero mb-5">
                <div className="row py-5">
                    <div className="col-12 text-center">
                        <h1 className="display-2 text-uppercase text-white mb-md-4">
                            Membership Plans
                        </h1>
                        <div className="d-flex justify-content-center gap-3">
                            <Link href="/" className="btn btn-primary py-md-3 px-md-5 btn-hero">Home</Link>

                            <Link className="btn btn-light py-md-3 px-md-5 btn-hero" href="/subscription">Subscription</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="membership-container">
                {/* Warning for maximum subscriptions reached */}
                {hasTwoOrMoreActiveSubscriptions() && (
                    <div className="alert alert-warning text-center mb-4">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        You&apos;ve reached the maximum number of active subscriptions (2).
                        You can&apos;t subscribe to additional plans until one of your current subscriptions expires.
                    </div>
                )}

                {/* Motivational Section */}
                <div className="text-center mb-5">
                    <h2 className="text-uppercase mb-3">Transform Your Life Today</h2>
                    <p className="lead mb-4">
                        &quot;The only bad workout is the one that didn&apos;t happen. Invest in yourself today and unlock your full potential with our expert guidance and world-class facilities.&quot;
                    </p>

                    <p className="mb-4">
                        Every great journey begins with a single step. Your fitness transformation starts here.
                    </p>

                </div>

                {/* Plans Grid */}
                <div className="membership-plans-grid custom-plan-grid">
                    {plans.map((plan) => {
                        const originalPrice = plan.price / (1 - plan.discount / 100);
                        const hasDiscount = plan.discount > 0;
                        const currentSubscription = getCurrentSubscription(plan.id);
                        const buttonState = getButtonState(plan);
                        const maxSubscriptionsReached = hasTwoOrMoreActiveSubscriptions();
                        const highestPricedPlan = getHighestPricedActivePlan();
                        const isHigherPriced = highestPricedPlan && plan.final_price > highestPricedPlan.final_price;

                        return (
                            <div key={plan.id} className={`membership-plan-card custom-plan-card ${buttonState === 'current' || buttonState === 'extended' ? 'current-plan' : ''}`}>
                                {/* Current Plan Badge */}
                                {(buttonState === 'current' || buttonState === 'extended') && (
                                    <div className="current-plan-badge">
                                        {buttonState === 'extended' ? 'Extended Plan' : 'Current Plan'}
                                    </div>
                                )}

                                <div className="plan-card-content custom-plan-content">
                                    {/* Plan Name */}
                                    <h6 className="plan-name custom-plan-name">{plan.name}</h6>

                                    {/* Price Display */}
                                    <div className="price-container custom-price-container">
                                        {hasDiscount && (
                                            <span className="original-price custom-original-price">
                                                ₹{Math.round(originalPrice)}
                                            </span>
                                        )}
                                        <h5 className="plan-price custom-plan-price">₹{plan.final_price}</h5>
                                        {hasDiscount && (
                                            <span className="discount-badge custom-discount-badge">
                                                Save {plan.discount}%
                                            </span>
                                        )}
                                    </div>

                                    {/* Expiry Date for Current Plans */}
                                    {(buttonState === 'current' || buttonState === 'extended') && currentSubscription && (
                                        <div className="expiry-date-container bg-light p-3 rounded mb-3 text-center">
                                            <p className="mb-1 text-muted small">Your plan expires on</p>
                                            <p className="mb-0 text-dark fw-bold">
                                                {formatDate(currentSubscription.expiry_date)}
                                                {buttonState === 'extended' && (
                                                    <span className="badge bg-success ms-2">Extended</span>
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {/* Plan Benefits */}
                                    <div className="plan-details custom-plan-details">
                                        <p className="plan-duration custom-plan-duration">
                                            <i className="bi bi-calendar-check me-2"></i>
                                            {plan.planInfo?.line_1}
                                        </p>
                                        <p className="plan-benefits custom-plan-benefit">
                                            <i className="bi bi-check-circle me-2"></i>
                                            {plan.planInfo?.line_2}
                                        </p>
                                        <p className="plan-benefits custom-plan-benefit">
                                            <i className="bi bi-check-circle me-2"></i>
                                            {plan.planInfo?.line_3}
                                        </p>
                                        <p className="plan-benefits custom-plan-benefit">
                                            <i className="bi bi-check-circle me-2"></i>
                                            {plan.planInfo?.line_4}
                                        </p>
                                        <p className="plan-benefits custom-plan-benefit">
                                            <i className="bi bi-check-circle me-2"></i>
                                            {plan.planInfo?.line_5}
                                        </p>
                                    </div>

                                    {/* Motivational Message */}
                                    <div className="plan-motivation-container custom-motivation-container">
                                        <p className="plan-motivation custom-plan-motivation">
                                            {plan.planInfo?.line_6}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="plan-buttons-container">
                                        {buttonState === 'extended' ? (
                                            <button
                                                className="btn btn-success py-md-3 px-md-5 w-100"
                                                disabled
                                            >
                                                <i className="bi bi-check-circle me-2"></i>
                                                Plan Extended
                                            </button>
                                        ) : buttonState === 'current' ? (
                                            <>
                                                <button
                                                    className="btn btn-success py-md-3 px-md-5 w-100"
                                                    disabled
                                                >
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    Current Plan
                                                </button>
                                                <button
                                                    className={`btn ${maxSubscriptionsReached ? 'btn-outline-secondary' : 'btn-outline-primary'} py-md-2 px-md-4 mt-2 w-100`}
                                                    onClick={() => !maxSubscriptionsReached && handleSubscribe(plan)}
                                                    disabled={maxSubscriptionsReached}
                                                >
                                                    <i className="bi bi-arrow-repeat me-2"></i>
                                                    {maxSubscriptionsReached ? 'Maximum Reached' : 'Extend Plan'}
                                                </button>
                                            </>
                                        ) : buttonState === 'upgrade' ? (
                                            <button
                                                className={`btn ${maxSubscriptionsReached ? 'btn-outline-secondary' : 'btn-outline-warning'} py-md-3 px-md-5 w-100`}
                                                onClick={() => !maxSubscriptionsReached && handleSubscribe(plan)}
                                                disabled={maxSubscriptionsReached}
                                            >
                                                <i className="bi bi-arrow-up-circle me-2"></i>
                                                {maxSubscriptionsReached ? 'Maximum Reached' : 'Upgrade Plan'}
                                            </button>
                                        ) : (
                                            <button
                                                className={`btn ${maxSubscriptionsReached ? 'btn-secondary' : 'btn-primary'} py-md-3 px-md-5 w-100`}
                                                onClick={() => !maxSubscriptionsReached && handleSubscribe(plan)}
                                                disabled={maxSubscriptionsReached}
                                            >
                                                <i className="bi bi-lightning-charge me-2"></i>
                                                {maxSubscriptionsReached ? 'Maximum Reached' : 'Get Plan'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Additional Note */}
                                    <p className="text-muted small mt-2 custom-plan-note">
                                        {plan.planInfo?.line_7}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Closing Motivational Section */}
                <div className="text-center mt-5">
                    <h4 className="mb-3">Still Hesitating?</h4>

                    <p>
                        &quot;Your body can stand almost anything. It&apos;s your mind you need to convince. Take the leap - your future self will thank you!&quot;
                    </p>


                </div>
            </div>
        </>
    );
};

export default MembershipPage;

