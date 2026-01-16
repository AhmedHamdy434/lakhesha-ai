import BgGradient from "@/components/common/bg-gradient";
import SourceInfo from "@/components/summaries/source-info";
import SummaryHeader from "@/components/summaries/summary-header";
import SummaryViewer from "@/components/summaries/summary-viewer";
import { getSummaryById } from "@/lib/summaries";
import { FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { MotionDiv } from "@/components/common/motion-wrapper";

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const summary = await getSummaryById(id);
  if (!summary) {
    return notFound();
  }
  const {
    title,
    summary_text,
    file_name,
    word_count,
    created_at,
    original_file_url,
  } = summary;
  const readingTime = Math.ceil((word_count || 0) / 200);
  return (
    <div className="relative min-h-screen isolate bg-linear-to-b from-rose-50/40 to-white">
      <BgGradient className="from-rose-400 via-rose-400 to-orange-200" />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-4 sm:px-6 lg:px-8 sm:py-12 lg:py-24">
          <div className="flex flex-col">
            <SummaryHeader
              title={title}
              created_at={created_at}
              readingTime={readingTime}
            />
          </div>
          {file_name && (
            <SourceInfo
              file_name={file_name}
              title={title}
              summary_text={summary_text}
              created_at={created_at}
              original_file_url={original_file_url}
            />
          )}
          <div className="relative mt-4 sm:mt-8 lg:mt-16">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-md rounded-2xl
            sm:rounded-3xl shadow-3xl border border-rose-100/30 transition-all duration-300 hover:shadow-2xl
            hover:bg-white/90 max-w-3xl mx-auto"
            >
              <MotionDiv
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm
                text-muted-foreground bg-white/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs"
              >
                <FileText className="size-3 sm:size-4 text-rose-400" />
                {word_count} كلمة
              </MotionDiv>
              <div className="relative mt-8 sm:mt-6 flex justify-center">
                <SummaryViewer summary={summary_text} />
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6:14
