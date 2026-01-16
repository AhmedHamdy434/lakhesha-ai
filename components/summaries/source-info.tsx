import { ExternalLink, FileText } from "lucide-react";
import { Button } from "../ui/button";
import DownloadSummaryButton from "./download-summary-button";
import { MotionDiv } from "../common/motion-wrapper";

export default function SourceInfo({
  file_name,
  original_file_url,
  title,
  summary_text,
  created_at,
}: {
  file_name: string;
  original_file_url: string;
  title: string;
  summary_text: string;
  created_at: string;
}) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex flex-col lg:flex-row items-center gap-4 justify-between text-sm text-muted-foreground"
    >
      <div className="flex items-center gap-2 justify-center">
        <FileText className="size-4 text-rose-400" />
        <span>المصدر: {file_name}</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          asChild
        >
          <a href={original_file_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4 me-1" /> عرض الملف الأصلي
          </a>
        </Button>
        <DownloadSummaryButton
          title={title}
          summary_text={summary_text}
          file_name={file_name}
          created_at={created_at}
        />
      </div>
    </MotionDiv>
  );
}
