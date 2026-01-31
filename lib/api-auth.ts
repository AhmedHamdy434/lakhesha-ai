import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Authentication middleware for REST API endpoints
 * Extracts and validates Clerk authentication from headers
 *
 * Usage in route handlers:
 * ```ts
 * const authResult = await authenticateRequest(request);
 * if (!authResult.authenticated) {
 *   return authResult.response;
 * }
 * const userId = authResult.userId;
 * ```
 */
export async function authenticateRequest(
  request: NextRequest,
): Promise<
  | { authenticated: true; userId: string }
  | { authenticated: false; response: NextResponse }
> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        authenticated: false,
        response: NextResponse.json(
          {
            success: false,
            error: "Unauthorized",
            message:
              "Authentication required. Please provide a valid session token.",
          },
          { status: 401 },
        ),
      };
    }

    return {
      authenticated: true,
      userId,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Authentication failed",
          message: "Failed to validate authentication token.",
        },
        { status: 401 },
      ),
    };
  }
}

/**
 * Standard error response helper
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  error?: any,
) {
  console.error(`API Error (${statusCode}):`, message, error);
  return NextResponse.json(
    {
      success: false,
      error: error instanceof Error ? error.message : error,
      message,
    },
    { status: statusCode },
  );
}

/**
 * Standard success response helper
 */
export function successResponse(data?: any, message?: string) {
  return NextResponse.json({
    success: true,
    message: message || "Operation completed successfully",
    data: data || null,
  });
}
