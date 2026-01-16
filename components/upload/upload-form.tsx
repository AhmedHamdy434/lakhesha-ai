"use client";
import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from "./loading-skelton";

const schema = z.object({
  file: z
    .instanceof(File, { message: "الملف غير صالح" })
    .refine(
      (file) => file.size < 1024 * 1024 * 1,
      "حجم الملف يجب أن يكون أقل من 1 ميجابايت"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "الملف يجب أن يكون PDF"
    ),
});

const UploadForm = () => {
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onUploadError: (error) => {
      toast.error(error.message ?? "فشل رفع الملف");
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // ****** validate the file
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      const validatedFields = schema.safeParse({ file });

      if (!validatedFields.success) {
        toast.error(validatedFields.error.errors[0].message ?? "فشل رفع الملف");
        setIsLoading(false);
        return;
      }
      // ****** upload the file
      const uploading = startUpload([file]);
      toast.promise(uploading, {
        loading: "جاري رفع الملف...",
        success:
          "جاري معالجة الملف... يرجى الانتظار! الذكاء الاصطناعي يقرأ المستند الخاص بك",
        error: "فشل رفع الملف",
      });
      const resp = await uploading;

      if (!resp) {
        toast.error("فشل رفع الملف");
        setIsLoading(false);
        return;
      }
      // ****** generate the summary in server action
      const summaryPromise = generatePdfSummary(resp);
      toast.promise(summaryPromise, {
        loading: "جاري إنشاء الملخص...",
        success: "تم إنشاء الملخص بنجاح",
        error: "فشل إنشاء الملخص",
      });
      const result = await summaryPromise;
      const { data = null, message = null } = result || {};
      if (data) {
        let storeResult: any;
        //  ******* store the summary in server action
        if (data.summary) {
          const storePromise = storePdfSummaryAction({
            summary: data.summary,
            fileUrl: resp[0].serverData.uploadedBy,
            title: data.title,
            fileName: file.name,
          });
          toast.promise(storePromise, {
            loading: "جاري حفظ الملخص...",
            success: "تم حفظ الملخص بنجاح",
            error: "فشل حفظ الملخص",
          });
          storeResult = await storePromise;
          if (storeResult.success) {
            toast.success(message ?? "تم حفظ الملخص بنجاح", {
              description:
                "تم تلخيص وحفظ ملف الـ PDF الخاص بك بنجاح",
            });
          } else {
            toast.error(storeResult.message);
          }
          formRef.current?.reset();
          // ****** redirect to the summary page
          router.push(`/summaries/${storeResult.data?.id}`);
        }
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("حدث خطأ");
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
      {isLoading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">
                جاري المعالجة...
              </span>
            </div>
          </div>
          <LoadingSkeleton />
        </>
      )}
    </div>
  );
};

export default UploadForm;
