import Link from "next/link";
import { Button } from "../ui/button";
import { Calendar, ChevronLeft, Clock, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { MotionDiv, MotionH1 } from "../common/motion-wrapper";

export default function SummaryHeader({
  title,
  created_at,
  readingTime,
}: {
  title: string;
  created_at: string;
  readingTime: number;
}) {
  return (
    <div className="flex justify-between">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Badge
              variant="secondary"
              className="text-sm relative px-4 py-1.5 font-medium bg-white/80 backdrop-blur-xs rounded-full shadow-xs
          transition-all duration-200 hover:bg-white/90 hover:shadow-md"
            >
              <Sparkles className="size-4 text-rose-500 me-1.5" />
              ملخص الذكاء الاصطناعي
            </Badge>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Calendar className="size-4 text-rose-400" />
            {new Date(created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Clock className="size-4 text-rose-400" />
            {readingTime} دقيقة قراءة
          </MotionDiv>
        </div>
        <MotionH1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl lg:text-4xl font-bold lg:tracking-tight"
        >
          <span className="bg-linear-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
            {title}
          </span>
        </MotionH1>
      </div>
      <MotionDiv
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link href={"/dashboard"}>
          <Button
            variant="link"
            size="sm"
            className="group flex items-center gap-1 sm:gap-2 hover:bg-white/80 backdrop-blur-xs rounded-full
          transition-all duration-200 shadow-xs hover:shadow-md border border-rose-100/30 bg-rose-100 px-2 sm:px-3"
          >
            <ChevronLeft className="size-3 sm:size-4 text-rose-500 transition-transform group-hover:translate-x-0.5" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              رجوع <span className="hidden sm:inline">إلى لوحة التحكم</span>
            </span>
          </Button>
        </Link>
      </MotionDiv>
    </div>
  );
}
