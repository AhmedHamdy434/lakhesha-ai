import BgGradient from "@/components/common/bg-gradient";
import EmptySummaryState from "@/components/summaries/empty-summary-state";
import SummaryCard from "@/components/summaries/summary-card";
import { Button } from "@/components/ui/button";
import { getSummaries } from "@/lib/summaries";
import { hasReachedUploadLimit } from "@/lib/users";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  MotionDiv,
  MotionH1,
  MotionP,
} from "@/components/common/motion-wrapper";
import { containerVariants } from "@/utils/constants";

const DashboardPage = async () => {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    return redirect("/sign-in");
  }
  const { hasReachedLimit, upload_limit } = await hasReachedUploadLimit(user);
  const summaries = await getSummaries(userId);
  return (
    <main className="min-h-screen">
      <BgGradient className="from-emerald-200 via-teal-200 to-cyan-200" />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-2 py-12 sm:py-24">
          <div className="flex justify-between gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <MotionH1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-600 to-gray-900 dark:from-gray-500 dark:to-gray-300 bg-clip-text text-transparent"
              >
                ملخصاتك
              </MotionH1>
              <MotionP
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-600 dark:text-gray-400"
              >
                حول ملفاتك إلى ملخصات ذكية
              </MotionP>
            </div>
            {!hasReachedLimit && (
              <MotionDiv
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Button
                  variant="link"
                  className="bg-linear-to-r from-rose-500 to-rose-700 hover:to-rose-800
            hover:scale-105 transition-all duration-300 group hover:no-underline"
                >
                  <Link
                    href="/upload"
                    className="flex items-center text-white gap-2"
                  >
                    <Plus className="size-5" />
                    ملخص جديد
                  </Link>
                </Button>
              </MotionDiv>
            )}
          </div>
          {hasReachedLimit && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6"
            >
              <div className="bg-red-50 border border-rose-200 p-4 text-rose-800 rounded-lg">
                <p className="text-sm">
                  لقد وصلت إلى الحد الأقصى لعدد الملخصات وهو {upload_limit}.
                  <Link
                    href="/#pricing"
                    className="text-rose-800 underline font-medium underline-offset-4 inline-flex items-center"
                  >
                    اضغط هنا للترقية إلى برو{" "}
                    <ArrowLeft className="size-4 inline-block" />{" "}
                  </Link>
                  للحصول على ملخصات غير محدودة
                </p>
              </div>
            </MotionDiv>
          )}
          {summaries.length === 0 ? (
            <EmptySummaryState />
          ) : (
            <MotionDiv
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 sm:px-0"
            >
              {summaries.map((summary, index) => (
                <MotionDiv
                  key={summary.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <SummaryCard summary={summary} />
                </MotionDiv>
              ))}
            </MotionDiv>
          )}
        </div>
      </div>
    </main>
  );
};
export default DashboardPage;
// 4:27
