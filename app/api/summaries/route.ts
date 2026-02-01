import { NextRequest } from "next/server";
import { getDbConnection } from "@/lib/db";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

/**
 * GET /api/summaries
 *
 * Get all PDF summaries for the authenticated user
 *
 * @headers
 * - Authorization: Bearer <clerk_session_token> (required)
 *
 * @query parameters (optional)
 * - page: Page number for pagination (default: 1)
 * - limit: Number of items per page (default: 10, max: 100)
 * - sortBy: Field to sort by (default: 'created_at')
 * - order: Sort order 'asc' or 'desc' (default: 'desc')
 *
 * @returns
 * - 200: {
 *     success: true,
 *     data: {
 *       summaries: Array<Summary>,
 *       pagination: { page, limit, total, totalPages }
 *     },
 *     message: "Summaries retrieved successfully"
 *   }
 * - 401: { success: false, error: "Unauthorized" }
 * - 500: { success: false, error: "Internal server error" }
 *
 * @notes
 * - Returns summaries in descending order by creation date (newest first)
 * - Each summary includes: id, title, fileName, summaryText, originalFileUrl, status, createdAt, updatedAt
 * - Supports pagination for better performance
 *
 * @example React Native
 * ```typescript
 * // Get all summaries (default pagination)
 * const response = await fetch(`${API_URL}/api/summaries`, {
 *   method: 'GET',
 *   headers: {
 *     'Authorization': `Bearer ${clerkToken}`,
 *   },
 * });
 * const data = await response.json();
 * if (data.success) {
 *   const summaries = data.data.summaries;
 *   const pagination = data.data.pagination;
 *   // Display summaries in your UI
 * }
 *
 * // Get summaries with pagination
 * const response = await fetch(
 *   `${API_URL}/api/summaries?page=2&limit=20`,
 *   {
 *     method: 'GET',
 *     headers: {
 *       'Authorization': `Bearer ${clerkToken}`,
 *     },
 *   }
 * );
 * ```
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    // Authenticate user
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const userId = authResult.userId;

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "10", 10),
      100,
    );
    const sortBy = searchParams.get("sortBy") || "created_at";
    const order = searchParams.get("order") || "desc";

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return errorResponse("Invalid pagination parameters", 400);
    }

    // Validate sort parameters
    const allowedSortFields = [
      "created_at",
      "updated_at",
      "title",
      "file_name",
    ];
    if (!allowedSortFields.includes(sortBy)) {
      return errorResponse(
        `Invalid sortBy field. Allowed fields: ${allowedSortFields.join(", ")}`,
        400,
      );
    }

    if (order !== "asc" && order !== "desc") {
      return errorResponse("Invalid order. Use 'asc' or 'desc'", 400);
    }

    // Get database connection
    const sql = await getDbConnection();

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await sql`
      SELECT COUNT(*) as total 
      FROM pdf_summaries 
      WHERE user_id = ${userId}
    `;
    const total = parseInt(countResult.total, 10);

    // Get summaries with pagination
    // Build ORDER BY clause based on validated parameters
    let summaries;

    if (sortBy === "created_at") {
      summaries =
        order === "desc"
          ? await sql`
            SELECT 
              id,
              title,
              file_name as "fileName",
              summary_text as "summaryText",
              original_file_url as "originalFileUrl",
              status,
              created_at as "createdAt",
              updated_at as "updatedAt"
            FROM pdf_summaries
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
            LIMIT ${limit}
            OFFSET ${offset}
          `
          : await sql`
            SELECT 
              id,
              title,
              file_name as "fileName",
              summary_text as "summaryText",
              original_file_url as "originalFileUrl",
              status,
              created_at as "createdAt",
              updated_at as "updatedAt"
            FROM pdf_summaries
            WHERE user_id = ${userId}
            ORDER BY created_at ASC
            LIMIT ${limit}
            OFFSET ${offset}
          `;
    } else if (sortBy === "updated_at") {
      summaries =
        order === "desc"
          ? await sql`
            SELECT 
              id,
              title,
              file_name as "fileName",
              summary_text as "summaryText",
              original_file_url as "originalFileUrl",
              status,
              created_at as "createdAt",
              updated_at as "updatedAt"
            FROM pdf_summaries
            WHERE user_id = ${userId}
            ORDER BY updated_at DESC
            LIMIT ${limit}
            OFFSET ${offset}
          `
          : await sql`
            SELECT 
              id,
              title,
              file_name as "fileName",
              summary_text as "summaryText",
              original_file_url as "originalFileUrl",
              status,
              created_at as "createdAt",
              updated_at as "updatedAt"
            FROM pdf_summaries
            WHERE user_id = ${userId}
            ORDER BY updated_at ASC
            LIMIT ${limit}
            OFFSET ${offset}
          `;
    } else if (sortBy === "title") {
      summaries =
        order === "desc"
          ? await sql`
            SELECT 
              id,
              title,
              file_name as "fileName",
              summary_text as "summaryText",
              original_file_url as "originalFileUrl",
              status,
              created_at as "createdAt",
              updated_at as "updatedAt"
            FROM pdf_summaries
            WHERE user_id = ${userId}
            ORDER BY title DESC
            LIMIT ${limit}
            OFFSET ${offset}
          `
          : await sql`
            SELECT 
              id,
              title,
              file_name as "fileName",
              summary_text as "summaryText",
              original_file_url as "originalFileUrl",
              status,
              created_at as "createdAt",
              updated_at as "updatedAt"
            FROM pdf_summaries
            WHERE user_id = ${userId}
            ORDER BY title ASC
            LIMIT ${limit}
            OFFSET ${offset}
          `;
    } else {
      // file_name
      summaries =
        order === "desc"
          ? await sql`
            SELECT 
              id,
              title,
              file_name as "fileName",
              summary_text as "summaryText",
              original_file_url as "originalFileUrl",
              status,
              created_at as "createdAt",
              updated_at as "updatedAt"
            FROM pdf_summaries
            WHERE user_id = ${userId}
            ORDER BY file_name DESC
            LIMIT ${limit}
            OFFSET ${offset}
          `
          : await sql`
            SELECT 
              id,
              title,
              file_name as "fileName",
              summary_text as "summaryText",
              original_file_url as "originalFileUrl",
              status,
              created_at as "createdAt",
              updated_at as "updatedAt"
            FROM pdf_summaries
            WHERE user_id = ${userId}
            ORDER BY file_name ASC
            LIMIT ${limit}
            OFFSET ${offset}
          `;
    }

    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        summaries,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      "Summaries retrieved successfully",
    );
  } catch (error) {
    console.error("Failed to retrieve summaries:", error);
    return errorResponse("Failed to retrieve summaries", 500, error);
  }
}
