import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UpgradeRequired from "@/components/common/upgrade-required";
import { hasActivPlan } from "@/lib/users";

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user?.id) {
    redirect("/sign-in");
  }
  const hasActiveSubscription = await hasActivPlan(
    user.emailAddresses[0].emailAddress
  );
  if (!hasActiveSubscription) {
    return <UpgradeRequired />;
  }
  return <>{children}</>;
}