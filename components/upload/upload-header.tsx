import { Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { MotionDiv, MotionH1, MotionP } from "../common/motion-wrapper";

const UploadHeader = () => {
  return (
    <>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-0.25 overflow-hidden rounded-full bg-linear-to-r from-rose-200 via-rose-500 to-rose-800
          animate-gradient-x group"
      >
        <Badge
          variant="secondary"
          className="px-6 py-2 font-medium bg-white rounded-full group-hover:bg-gray-50
            transition-colors duration-200"
        >
          <Sparkles className="size-6! me-2 text-rose-200 animate-pulse" />
          <p className="text-rose-600 text-base">صناعة المحتوى بالذكاء الاصطناعي</p>
        </Badge>
      </MotionDiv>
      <MotionH1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-bold py-6 text-center"
      >
        ابدأ الرفع
        <span className="relative inline-block">
          <span
            className="absolute inset-0 bg-rose-200/50 -rotate-2 rounded-lg transform -skew-y-1"
            aria-hidden="true"
          ></span>
          <span className="px-2 relative z-10">ملفات الـ PDF</span>
        </span>
      </MotionH1>
      <MotionP
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center text-lg sm:text-xl lg:text-2xl px-4 lg:px-0 lg:max-w-4xl
          text-gray-600"
      >
        ارفع ملف الـ PDF الخاص بك ودع الذكاء الاصطناعي يقوم بالباقي
      </MotionP>
    </>
  );
};

export default UploadHeader;
