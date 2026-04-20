import { cn } from "@/lib/utils";

import { ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import {
  MotionDiv,
  MotionH1,
  MotionH2,
  MotionSection,
  MotionSpan,
} from "../common/motion-wrapper";
import {
  buttonVariants,
  containerVariants,
  itemVariants,
} from "@/utils/constants";

const HeroSection = () => {
  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative mx-auto flex flex-col items-center justify-center py-16 sm:py-20
    lg:py-28 transition-all animate-in lg:px-12 max-w-7xl"
    >
      <MotionDiv
        variants={itemVariants}
        className="p-0.25 overflow-hidden rounded-full bg-linear-to-r from-rose-200 via-rose-500 to-rose-800
          animate-gradient-x group"
      >
        <Badge
          variant="secondary"
          className="px-6 py-2 font-medium bg-white rounded-full group-hover:bg-gray-50
          transition-colors duration-200"
        >
          <Sparkles className="size-6! me-2 text-rose-600 animate-pulse" aria-hidden="true" />
          <p className="text-rose-600 text-base">لخصها بالذكاء الاصطناعي</p>
        </Badge>

      </MotionDiv>
      <MotionH1 variants={itemVariants} className="font-bold py-6 text-center">
        حوّل ملفات PDF إلى
        <span className="relative inline-block">
          <span
            className="absolute inset-0 bg-rose-200/50 -rotate-2 rounded-lg transform -skew-y-1"
            aria-hidden="true"
          ></span>
          <span className="px-2 relative z-10">
            <MotionSpan whileHover={buttonVariants}>ملخصات</MotionSpan>
          </span>
        </span>
        باللغة العربية
      </MotionH1>
      <MotionH2
        variants={itemVariants}
        className="text-center text-lg sm:text-xl lg:text-2xl px-4 lg:px-0 lg:max-w-4xl
        text-gray-700 dark:text-gray-200"
      >
        احصل على ملخص جميل للمستند في ثوانٍ باللغة العربية.
      </MotionH2>

      <MotionDiv variants={itemVariants} whileHover={buttonVariants}>
        <Link
          href="/#pricing"
          scroll
          aria-label="ابدأ الآن وجرب لخصها"
          className={cn(
            "text-white mt-6 sm:text-lg lg:text-xl rounded-full px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 lg:mt-16 bg-linear-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900 hover:no-underline font-bold shadow-lg transition-all duration-300 flex items-center gap-2"
          )}
        >
          <span>جرب لخصها</span>
          <ArrowLeft className="animate-pulse" aria-hidden="true" />
        </Link>
      </MotionDiv>

    </MotionSection>
  );
};
export default HeroSection;
