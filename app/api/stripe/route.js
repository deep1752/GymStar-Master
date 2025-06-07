import Stripe from 'stripe';

/**
 * Initialize Stripe with secret key from environment variables
 * Using require() instead of import for compatibility
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST handler for creating Stripe checkout sessions
 * @param {Request} request - The incoming request object
 * @returns {Response} - Returns Stripe session ID or error
 */
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Destructure required fields from request body
    const { 
      planName, 
      price, 
      originalPrice,
      discount,
      final_price,
      membership_id, 
      plan_type, 
      promocode, 
      user_id 
    } = body;

    /**
     * Create Stripe checkout session with:
     * - Card payment method
     * - Single line item for the membership
     * - Metadata for backend reference
     */
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',  // Indian Rupees
            product_data: {
              name: planName,
              description: `${plan_type} membership`,
            },
            // Convert final price to cents/paisa (Stripe requires integer amounts)
            unit_amount: Math.round(final_price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',  // One-time payment
      
      // Redirect URLs
      success_url: process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL,
      cancel_url: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL,
      
      // Store additional data in metadata for webhook handling
      metadata: {
        planName,
        price,
        originalPrice,
        discount,
        final_price,
        membership_id,
        plan_type,
        promocode,
        user_id,
      },
    });

    // Return session ID to frontend
    return new Response(JSON.stringify({ id: session.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    // Handle errors and return appropriate response
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}