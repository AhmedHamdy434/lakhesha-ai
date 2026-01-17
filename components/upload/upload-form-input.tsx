"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { MotionDiv } from "../common/motion-wrapper";

interface UploadFormInputProps {
  ref: React.RefObject<HTMLFormElement | null>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const UploadFormInput = ({
  ref,
  onSubmit,
  isLoading,
}: UploadFormInputProps) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <form ref={ref} onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex justify-end items-center gap-1.5">
          <Input
            type="file"
            id="file"
            name="file"
            accept="application/pdf"
            required
            className={cn("", isLoading && "cursor-not-allowed opacity-50")}
            disabled={isLoading}
          />
          <Button className="bg-rose-600 dark:bg-rose-400 text-white dark:text-black" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" /> جاري المعالجة...
              </>
            ) : (
              "رفع الملف"
            )}
          </Button>
        </div>
      </form>
    </MotionDiv>
  );
};

export default UploadFormInput;
