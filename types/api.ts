/**
 * TypeScript types for REST API endpoints
 *
 * Share this file between Next.js backend and React Native app
 * for type-safe API calls.
 */

// ============================================
// Common Response Types
// ============================================

export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// Summary Types
// ============================================

export interface Summary {
  id: number;
  user_id: string;
  title: string;
  file_name: string;
  summary_text: string;
  original_file_url: string;
  created_at: string;
  updated_at?: string;
}

// ============================================
// API Request Types
// ============================================

/**
 * POST /api/summaries/generate
 */
export interface GenerateSummaryRequest {
  // Simplified format
  pdfUrl: string;
  fileName: string;
}

export interface GenerateSummaryRequestUploadThing {
  // UploadThing format
  uploadResponse: Array<{
    name: string;
    ufsUrl: string;
    serverData: {
      uploadedBy: string;
    };
  }>;
}

export interface GenerateSummaryResponse {
  summary: string;
  title: string;
}

/**
 * POST /api/summaries/store
 */
export interface StoreSummaryRequest {
  summary: string;
  fileUrl: string;
  title: string;
  fileName: string;
}

export interface StoreSummaryResponse {
  id: number;
  title: string;
  fileName: string;
  createdAt: string;
}

/**
 * DELETE /api/summaries/[id]
 */
export interface DeleteSummaryResponse {
  id: string;
}

// ============================================
// Error Types
// ============================================

export interface APIError {
  success: false;
  error: string;
  message: string;
  statusCode?: number;
}

// ============================================
// API Client Types
// ============================================

export interface APIClientConfig {
  baseURL: string;
  getToken: () => Promise<string | null>;
  timeout?: number;
}

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestOptions {
  method?: HTTPMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  requiresAuth?: boolean;
}

// ============================================
// Type Guards
// ============================================

export function isAPIError(response: any): response is APIError {
  return response && response.success === false && "error" in response;
}

export function isAPISuccess<T>(
  response: APIResponse<T>,
): response is Required<APIResponse<T>> {
  return response.success === true && "data" in response;
}

// ============================================
// Utility Types
// ============================================

export type Awaited<T> = T extends Promise<infer U> ? U : T;

export type APIEndpoint =
  | "/api/summaries/generate"
  | "/api/summaries/store"
  | `/api/summaries/${number}`;

// ============================================
// Example TypeScript API Client
// ============================================

/**
 * Example usage in React Native:
 *
 * ```typescript
 * import { useAuth } from '@clerk/clerk-expo';
 * import type { GenerateSummaryRequest, GenerateSummaryResponse } from './types/api';
 *
 * const MyComponent = () => {
 *   const { getToken } = useAuth();
 *
 *   const generateSummary = async (pdfUrl: string, fileName: string) => {
 *     const token = await getToken();
 *
 *     const response = await fetch(`${API_URL}/api/summaries/generate`, {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify({
 *         pdfUrl,
 *         fileName,
 *       } as GenerateSummaryRequest),
 *     });
 *
 *     const data: APIResponse<GenerateSummaryResponse> = await response.json();
 *
 *     if (!isAPISuccess(data)) {
 *       throw new Error(data.message || 'Failed to generate summary');
 *     }
 *
 *     return data.data; // TypeScript knows this is GenerateSummaryResponse
 *   };
 * };
 * ```
 */
