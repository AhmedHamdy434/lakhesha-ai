import { NextRequest, NextResponse } from "next/server";
import { fetchAndExtractText } from "@/lib/langchain";
import { generatePdfSummaryByOpenAI } from "@/lib/openai";
import { generatePdfSummaryByGemini } from "@/lib/geminiai";
import { formatFileNameAsTitle } from "@/utils/format-utils";

/**
 * دالة استجابة موحدة للنجاح والفشل
 */
const apiResponse = (success: boolean, message: string, data: any = null, status: number = 200) => {
  return NextResponse.json({ success, message, data }, { status });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. استخراج البيانات (يدعم تنسيق الويب والموبايل)
    let pdfUrl: string;
    let pdfName: string;

    if (body.uploadResponse && Array.isArray(body.uploadResponse)) {
      pdfUrl = body.uploadResponse[0].ufsUrl;
      pdfName = body.uploadResponse[0].name;
    } else {
      pdfUrl = body.pdfUrl;
      pdfName = body.fileName;
    }

    if (!pdfUrl || !pdfName) {
      return apiResponse(false, "بيانات الملف ناقصة (pdfUrl, fileName)", null, 400);
    }

    // 2. استخراج النص من الـ PDF
    let pdfText: string;
    try {
      pdfText = await fetchAndExtractText(pdfUrl);
    } catch (err) {
      console.error("Extraction Error:", err);
      return apiResponse(false, "فشل في قراءة محتوى ملف الـ PDF", null, 500);
    }

    // 3. محاولة التلخيص (OpenAI -> Fallback -> Gemini)
    let summary: string | null = null;
    let usedAI = "OpenAI";

    try {
      summary = await generatePdfSummaryByOpenAI(pdfText);
    } catch (error: any) {
      console.log("OpenAI limit hit or failed, switching to Gemini...");
      
      // نتحقق من الـ Rate Limit أو أي فشل آخر
      try {
        summary = await generatePdfSummaryByGemini(pdfText);
        usedAI = "Gemini";
      } catch (geminiError) {
        console.error("Both AI services failed:", geminiError);
        return apiResponse(false, "فشل جميع مزودي الخدمة AI حالياً", null, 503);
      }
    }

    if (!summary) {
      return apiResponse(false, "لم يتم إنتاج ملخص من السيرفر", null, 500);
    }

    // 4. تنسيق العنوان وإرجاع النتيجة
    const title = formatFileNameAsTitle(pdfName);

    console.log(`Summary generated successfully using ${usedAI}`);
    
    return apiResponse(true, "تم إنشاء الملخص بنجاح", {
      summary,
      title,
      aiProvider: usedAI
    });

  } catch (error: any) {
    console.error("Global API Error:", error);
    return apiResponse(false, error.message || "حدث خطأ غير متوقع", null, 500);
  }
}