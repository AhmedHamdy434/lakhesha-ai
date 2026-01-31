import { NextRequest, NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

/**
 * DELETE /api/summaries/[id]
 *
 * Delete a PDF summary by ID
 *
 * @headers
 * - Authorization: Bearer <clerk_session_token> (required)
 *
 * @params
 * - id: Summary ID to delete
 *
 * @returns
 * - 200: { success: true, message: "Summary deleted successfully" }
 * - 401: { success: false, error: "Unauthorized" }
 * - 404: { success: false, error: "Summary not found or unauthorized" }
 * - 500: { success: false, error: "Internal server error" }
 *
 * @example React Native
 * ```typescript
 * const response = await fetch(`${API_URL}/api/summaries/${summaryId}`, {
 *   method: 'DELETE',
 *   headers: {
 *     'Authorization': `Bearer ${clerkToken}`,
 *   },
 * });
 * const data = await response.json();
 * if (data.success) {
 *   // Summary deleted successfully
 *   // Manually refresh your summaries list
 * }
 * ```
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    // Authenticate user
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const userId = authResult.userId;
    const summaryId = (await params).id;

    // Validate summary ID
    if (!summaryId) {
      return errorResponse("Summary ID is required", 400);
    }

    // Get database connection
    const sql = await getDbConnection();

    // Delete summary (only if owned by user)
    const result = await sql`
      DELETE FROM pdf_summaries 
      WHERE id = ${summaryId} AND user_id = ${userId} 
      RETURNING id
    `;

    if (result.length === 0) {
      return errorResponse(
        "Summary not found or you don't have permission to delete it",
        404,
      );
    }

    return successResponse({ id: summaryId }, "Summary deleted successfully");
  } catch (error) {
    console.error("Failed to delete summary:", error);
    return errorResponse("Failed to delete summary", 500, error);
  }
}
