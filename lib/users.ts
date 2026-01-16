import { pricePlans } from "@/utils/constants";
import { getDbConnection } from "./db";
import { getUserUploadCount } from "./summaries";
import { User } from "@clerk/nextjs/server";

export async function getPriceId(email: string) {
  const sql = await getDbConnection();
  const query =
    await sql`SELECT price_id FROM users WHERE email = ${email} AND status = 'active'`;
const priceId = query[0]?.price_id;
console.log("priceId", priceId);
  return priceId || null;
}

export async function hasReachedUploadLimit(user: User) {
  const uploadCount = await getUserUploadCount(user.id);
  const priceId = await getPriceId(user.emailAddresses[0].emailAddress);
  const isPro =
    pricePlans.find((plan) => plan.priceId === priceId)?.id === "pro";
  const upload_limit = isPro ? 100 : 5;
  return { hasReachedLimit: uploadCount >= upload_limit, upload_limit };
}


export async function hasActivPlan(email: string) {
  const sql = await getDbConnection();
  const query =
    await sql`SELECT price_id, status FROM users WHERE email = ${email} AND status = 'active' AND price_id IS NOT NULL`;

  return query && query.length > 0;
}

export async function getSubscriptionStatus(user: User) {
  const hasSubscription = await hasActivPlan(user.emailAddresses[0].emailAddress);
  return hasSubscription;
}
