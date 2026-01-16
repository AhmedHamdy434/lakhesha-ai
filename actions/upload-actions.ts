"use server";

import { getDbConnection } from "@/lib/db";
import { generatePdfSummaryByGemini } from "@/lib/geminiai";
import { fetchAndExtractText } from "@/lib/langchain";
import { generatePdfSummaryByOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
  summary: string;
  fileUrl: string;
  title: string;
  fileName: string;
  userId?: string;
}

export const generatePdfSummary = async (
  uploadResponse: Array<{
    name: string;
    ufsUrl: string;
    serverData: {
      uploadedBy: string;
    };
  }>
) => {
  // ****** validate the upload response
  if (!uploadResponse || uploadResponse.length === 0) {
    return {
      success: false,
      error: "فشل رفع الملف",
      data: null,
    };
  }
  const { ufsUrl: pdfUrl, name: pdfName, serverData } = uploadResponse[0];
  try {
    // ****** fetch the pdf text
    const pdfText = await fetchAndExtractText(pdfUrl);
    let summary;
    try {
      // ****** generate the summary with openai
      summary = await generatePdfSummaryByOpenAI(pdfText);
    } catch (error) {
      console.log("openai failed");
      // ****** if openai rate limit exceeded generate the summary with gemini
      if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
        try {
          console.log("try gemini ai");
          summary = await generatePdfSummaryByGemini(pdfText);
        } catch (geminiError) {
          console.log(
            "Gemini API failed after OpenAI quote exceeded",
            geminiError
          );
          return {
            success: false,
            message: "Gemini API failed after OpenAI quote exceeded",
            data: null,
          };
        }
      }
    }
    // ****** if summary is not generated return error
    if (!summary) {
      return {
        success: false,
        message: "جميع مزودي الخدمة AI فشلوا، يرجى المحاولة مرة أخرى",
        data: null,
      };
    }
    // ****** format the title
    const formattedTitle = formatFileNameAsTitle(pdfName);
    // ****** summary generated successfully return the summary
    return {
      success: true,
      message: "تم إنشاء الملخص بنجاح",
      data: { summary, title: formattedTitle },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "فشل إنشاء الملخص",
      data: null,
    };
  }
};

async function savePdfSummaryToDatabase({
  userId,
  summary,
  fileUrl,
  title,
  fileName,
}: PdfSummaryType) {
  const sql = await getDbConnection();
  try {
    const [savedPdfSummary] = await sql`
  INSERT INTO pdf_summaries (
    user_id,
    original_file_url,
    summary_text,
    title,
    file_name
  )
  VALUES (
    ${userId},
    ${fileUrl},
    ${summary},
    ${title},
    ${fileName}
  )
  RETURNING id, summary_text;
`;

    return savedPdfSummary;
  } catch (error) {
    console.error("فشل حفظ الملخص في قاعدة البيانات:", error);
    throw error;
  }
}

export async function storePdfSummaryAction({
  summary,
  fileUrl,
  title,
  fileName,
}: PdfSummaryType) {
  let savedPdfSummary: any;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "المستخدم غير موجود",
      };
    }
    savedPdfSummary = await savePdfSummaryToDatabase({
      userId,
      summary,
      fileUrl,
      title,
      fileName,
    });
    if (!savedPdfSummary) {
      return {
        success: false,
        message: "فشل حفظ الملخص في قاعدة البيانات",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "فشل حفظ الملخص في قاعدة البيانات",
    };
  }
  revalidatePath(`/summaries/${savedPdfSummary.id}`);
  revalidatePath(`/dashboard`);
  return {
    success: true,
    message: "تم حفظ الملخص بنجاح",
    data: {
      id: savedPdfSummary.id,
    },
  };
}
