import { NextRequest } from "next/server";
import { getDbConnection } from "@/lib/db";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

interface StoreSummaryBody {
  summary: string;
  fileUrl: string;
  title: string;
  fileName: string;
}

/**
 * POST /api/summaries/store
 *
 * Store a generated PDF summary to the database
 *
 * @headers
 * - Authorization: Bearer <clerk_session_token> (required)
 * - Content-Type: application/json
 *
 * @body
 * ```json
 * {
 *   "summary": "The generated summary text...",
 *   "fileUrl": "https://uploadthing.com/...",
 *   "title": "Document Title",
 *   "fileName": "document.pdf"
 * }
 * ```
 *
 * @returns
 * - 200: { success: true, data: { id: number }, message: "Summary saved successfully" }
 * - 400: { success: false, error: "Validation error" }
 * - 401: { success: false, error: "Unauthorized" }
 * - 500: { success: false, error: "Database error" }
 *
 * @notes
 * - Requires authentication
 * - Creates a new record in pdf_summaries table
 * - Returns the ID of the created summary
 *
 * @example React Native
 * ```typescript
 * const response = await fetch(`${API_URL}/api/summaries/store`, {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${clerkToken}`,
 *   },
 *   body: JSON.stringify({
 *     summary: generatedSummary,
 *     fileUrl: uploadedPdfUrl,
 *     title: documentTitle,
 *     fileName: 'my-document.pdf'
 *   }),
 * });
 * const data = await response.json();
 * if (data.success) {
 *   const summaryId = data.data.id;
 *   // Navigate to summary detail or refresh list
 * }
 * ```
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Authenticate user
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const userId = authResult.userId;

    // Parse request body
    const body: StoreSummaryBody = await request.json();
    const { summary, fileUrl, title, fileName } = body;

    // Validate required fields
    if (!summary) {
      return errorResponse("Summary text is required", 400);
    }
    if (!fileUrl) {
      return errorResponse("File URL is required", 400);
    }
    if (!title) {
      return errorResponse("Title is required", 400);
    }
    if (!fileName) {
      return errorResponse("File name is required", 400);
    }

    // Get database connection
    const sql = await getDbConnection();

    // Save to database
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
      RETURNING id, summary_text, title, file_name, created_at;
    `;

    if (!savedPdfSummary) {
      return errorResponse("Failed to save summary to database", 500);
    }

    return successResponse(
      {
        id: savedPdfSummary.id,
        title: savedPdfSummary.title,
        fileName: savedPdfSummary.file_name,
        createdAt: savedPdfSummary.created_at,
      },
      "Summary saved successfully",
    );
  } catch (error) {
    console.error("Failed to store summary:", error);
    return errorResponse("Failed to save summary to database", 500, error);
  }
}
