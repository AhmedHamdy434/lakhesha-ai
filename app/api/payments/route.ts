import {
  handleCheckoutSessionCompleted,
  handleSubscriptionDeleted,
} from "@/lib/payments";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  try {
    event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret);

    // Handle the event
    switch (event.type) {
      // if the checkout session is completed
      case "checkout.session.completed":
        const sessionId = event.data.object.id;
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["line_items"],
        });
        console.log("session in route", session);
        await handleCheckoutSessionCompleted(session, stripe);
        break;
      // if the subscription is deleted
      case "customer.subscription.deleted":
        const subscriptionIdDeleted = event.data.object.id;
        const subscription = event.data.object;
        console.log("Subscription was deleted!", subscription);
        await handleSubscriptionDeleted(subscriptionIdDeleted, stripe);
        break;
      default:
        console.log(`Webhook event ${event.type} not handled.`);
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Invalid signature",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json({
    status: "success",
    message: "Hello from Stripe",
  });
};
