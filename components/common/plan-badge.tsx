import { getPriceId } from "@/lib/users";
import { pricePlans } from "@/utils/constants";
import { currentUser } from "@clerk/nextjs/server";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

export default async function PlanBadge() {
  const user = await currentUser();
  if (!user?.id) return null;

  const email = user?.emailAddresses?.[0]?.emailAddress;
  let priceId: string | null = null;
  if (email) {
    priceId = await getPriceId(email);
  }
  let planName = "Buy a plan";
  const plan = pricePlans.find((plan) => plan.priceId === priceId);
  if (plan) {
    planName = plan.name;
  }
  return (
    <Badge
      variant="outline"
      className={cn(
        "ms-2 bg-linear-to-r from-amber-100 to-amber-200 dark:from-amber-800 dark:to-amber-900 border-amber-300 hidden lg:flex items-center",
        !priceId && "from-red-100 to-red-200 border-red-300 dark:from-red-800 dark:to-red-900"
      )}
    >
      <Crown
        className={cn("size-3 me-1 text-amber-600 dark:text-amber-500", !priceId && "text-red-600")}
      />
      {planName}
    </Badge>
  );
}
