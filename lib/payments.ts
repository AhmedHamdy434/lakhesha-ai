import Stripe from "stripe";
import { getDbConnection } from "./db";

/**
 * Handle subscription cancellation
 */
export const handleSubscriptionDeleted = async (
  subscriptionId: string,
  stripe: Stripe
) => {
  const sql = await getDbConnection();

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await sql`
      UPDATE users
      SET status = 'cancelled'
      WHERE customer_id = ${subscription.customer}
    `;
  } catch (error) {
    console.error("handleSubscriptionDeleted error:", error);
    throw error;
  }
};

/**
 * Handle successful checkout
 */
export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
  stripe: Stripe
) => {
  const sql = await getDbConnection();
  try {
    const customerId = session.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    const priceId = session.line_items?.data[0]?.price?.id;

    if (!priceId) {
      throw new Error("Missing priceId in checkout session");
    }

    if (!("email" in customer) || !customer.email) {
      throw new Error("Customer email not found");
    }

    await createOrUpdateUser({
      sql,
      email: customer.email,
      full_name: customer.name ?? "",
      price_id: priceId,
      customer_id: customerId,
      status: "active",
    });

    await createPayment({
      sql,
      session,
      priceId,
      userEmail: customer.email,
    });
  } catch (error) {
    console.error("handleCheckoutSessionCompleted error:", error);
    throw error;
  }
};

/**
 * Create or update user (UPSERT)
 */
async function createOrUpdateUser({
  sql,
  email,
  full_name,
  price_id,
  customer_id,
  status,
}: {
  sql: any;
  email: string;
  full_name: string;
  price_id: string;
  customer_id: string;
  status: string;
}) {
  try {
    await sql`
      INSERT INTO users (email, full_name, price_id, customer_id, status)
      VALUES (${email}, ${full_name}, ${price_id}, ${customer_id}, ${status})
      ON CONFLICT (email)
      DO UPDATE SET
        full_name = EXCLUDED.full_name,
        price_id = EXCLUDED.price_id,
        customer_id = EXCLUDED.customer_id,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
    `;
  } catch (error) {
    console.error("createOrUpdateUser error:", error);
    throw error;
  }
}

/**
 * Create payment (idempotent)
 */
async function createPayment({
  sql,
  session,
  priceId,
  userEmail,
}: {
  sql: any;
  session: Stripe.Checkout.Session;
  priceId: string;
  userEmail: string;
}) {
  try {
    const { amount_total, id, status } = session;

    if (!amount_total) {
      throw new Error("amount_total is null");
    }

    await sql`
      INSERT INTO payments (
        amount,
        stripe_payment_id,
        user_email,
        status,
        price_id
      )
      VALUES (
        ${amount_total},
        ${id},
        ${userEmail},
        ${status},
        ${priceId}
      )
      ON CONFLICT (stripe_payment_id)
      DO NOTHING
    `;
  } catch (error) {
    console.error("createPayment error:", error);
    throw error;
  }
}
