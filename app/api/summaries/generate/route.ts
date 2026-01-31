import { NextRequest } from "next/server";
import { fetchAndExtractText } from "@/lib/langchain";
import { generatePdfSummaryByOpenAI } from "@/lib/openai";
import { generatePdfSummaryByGemini } from "@/lib/geminiai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { errorResponse, successResponse } from "@/lib/api-auth";

/**
 * POST /api/summaries/generate
 *
 * Generate an AI-powered summary from an uploaded PDF file
 *
 * @headers
 * - Content-Type: application/json
 *
 * @body
 * ```json
 * {
 *   "uploadResponse": [{
 *     "name": "document.pdf",
 *     "ufsUrl": "https://uploadthing.com/...",
 *     "serverData": {
 *       "uploadedBy": "user_123"
 *     }
 *   }]
 * }
 * ```
 *
 * OR simplified:
 * ```json
 * {
 *   "pdfUrl": "https://uploadthing.com/...",
 *   "fileName": "document.pdf"
 * }
 * ```
 *
 * @returns
 * - 200: { success: true, data: { summary: string, title: string }, message: string }
 * - 400: { success: false, error: "Invalid request" }
 * - 500: { success: false, error: "AI service error" }
 *
 * @notes
 * - Uses OpenAI as primary AI service
 * - Falls back to Gemini if OpenAI rate limit exceeded
 * - No authentication required (can be added if needed)
 *
 * @example React Native
 * ```typescript
 * const response = await fetch(`${API_URL}/api/summaries/generate`, {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify({
 *     pdfUrl: uploadedFileUrl,
 *     fileName: 'my-document.pdf'
 *   }),
 * });
 * const data = await response.json();
 * if (data.success) {
 *   console.log('Summary:', data.data.summary);
 *   console.log('Title:', data.data.title);
 * }
 * ```
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();

    // Support both uploadthing format and simplified format
    let pdfUrl: string;
    let pdfName: string;

    if (body.uploadResponse && Array.isArray(body.uploadResponse)) {
      // UploadThing format
      const uploadResponse = body.uploadResponse;

      if (!uploadResponse || uploadResponse.length === 0) {
        return errorResponse("Invalid upload response", 400);
      }

      const { ufsUrl, name } = uploadResponse[0];
      pdfUrl = ufsUrl;
      pdfName = name;
    } else if (body.pdfUrl && body.fileName) {
      // Simplified format for React Native
      pdfUrl = body.pdfUrl;
      pdfName = body.fileName;
    } else {
      return errorResponse(
        "Invalid request. Provide either 'uploadResponse' or 'pdfUrl' and 'fileName'",
        400,
      );
    }

    // Validate inputs
    if (!pdfUrl || !pdfName) {
      return errorResponse("PDF URL and file name are required", 400);
    }

    // Extract text from PDF
    let pdfText: string;
    try {
      pdfText = await fetchAndExtractText(pdfUrl);
    } catch (error) {
      console.error("Failed to extract PDF text:", error);
      return errorResponse("Failed to process PDF file", 400, error);
    }

    // Generate summary with AI
    let summary: string | null = null;

    try {
      // Try OpenAI first
      summary = await generatePdfSummaryByOpenAI(pdfText);
    } catch (error) {
      console.log("OpenAI failed, trying Gemini...");

      // Fallback to Gemini if OpenAI fails
      if (error instanceof Error && error.message === "Rate limit exceeded") {
        try {
          summary = await generatePdfSummaryByGemini(pdfText);
        } catch (geminiError) {
          console.error("Gemini API failed after OpenAI:", geminiError);
          return errorResponse(
            "All AI services failed. Please try again later.",
            503,
            geminiError,
          );
        }
      } else {
        throw error;
      }
    }

    // Check if summary was generated
    if (!summary) {
      return errorResponse("Failed to generate summary from AI services", 500);
    }

    // Format the title
    const formattedTitle = formatFileNameAsTitle(pdfName);

    return successResponse(
      {
        summary,
        title: formattedTitle,
      },
      "Summary generated successfully",
    );
  } catch (error) {
    console.error("Failed to generate summary:", error);
    return errorResponse("Failed to generate summary", 500, error);
  }
}
