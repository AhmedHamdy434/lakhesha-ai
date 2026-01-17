import { FileText } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { MotionDiv, MotionH2, MotionP } from "../common/motion-wrapper";

export default function EmptySummaryState() {
  return (
    <div className="text-center py-12 flex flex-col gap-4 items-center">
      <MotionDiv
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FileText className="size-6 text-gray-400" />
      </MotionDiv>
      <MotionH2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xl font-semibold text-gray-600 dark:text-gray-400"
      >
        لا يوجد ملخصات بعد
      </MotionH2>
      <MotionP
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-500 max-w-md dark:text-gray-400"
      >
        قم برفع أول ملف PDF للبدء في إنشاء الملخصات الذكية.
      </MotionP>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          variant="link"
          className="mt-4 text-white bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 hover:no-underline transition-all duration-300"
        >
          <Link href="/upload">إنشاء أول ملخص لك</Link>
        </Button>
      </MotionDiv>
    </div>
  );
}
