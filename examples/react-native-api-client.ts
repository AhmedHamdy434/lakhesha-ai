// /**
//  * React Native API Client Example
//  *
//  * This is a complete, production-ready API client for React Native
//  * that works with the REST API endpoints.
//  *
//  * Copy this file to your React Native project and customize as needed.
//  */

// import type {
//   APIResponse,
//   GenerateSummaryRequest,
//   GenerateSummaryResponse,
//   StoreSummaryRequest,
//   StoreSummaryResponse,
//   DeleteSummaryResponse,
//   Summary,
// } from "../types/api";

// // ============================================
// // Configuration
// // ============================================

// const API_URL = __DEV__
//   ? "http://localhost:3000" // Development
//   : "https://your-domain.com"; // Production

// const DEFAULT_TIMEOUT = 30000; // 30 seconds

// // ============================================
// // API Client Class
// // ============================================

// export class SummariesAPI {
//   private baseURL: string;
//   private getToken: () => Promise<string | null>;
//   private timeout: number;

//   constructor(
//     baseURL: string = API_URL,
//     getToken: () => Promise<string | null>,
//     timeout: number = DEFAULT_TIMEOUT,
//   ) {
//     this.baseURL = baseURL;
//     this.getToken = getToken;
//     this.timeout = timeout;
//   }

//   /**
//    * Internal method to make authenticated API calls
//    */
//   private async request<T>(
//     endpoint: string,
//     options: RequestInit = {},
//     requiresAuth: boolean = true,
//   ): Promise<T> {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), this.timeout);

//     try {
//       const headers: Record<string, string> = {
//         "Content-Type": "application/json",
//         ...(options.headers as Record<string, string>),
//       };

//       // Add authentication if required
//       if (requiresAuth) {
//         const token = await this.getToken();
//         if (!token) {
//           throw new Error("Authentication required. Please sign in.");
//         }
//         headers["Authorization"] = `Bearer ${token}`;
//       }

//       const response = await fetch(`${this.baseURL}${endpoint}`, {
//         ...options,
//         headers,
//         signal: controller.signal,
//       });

//       const data: APIResponse<T> = await response.json();

//       if (!data.success) {
//         throw new APIError(
//           data.message || "API request failed",
//           response.status,
//           data.error,
//         );
//       }

//       return data.data as T;
//     } catch (error) {
//       if (error instanceof APIError) {
//         throw error;
//       }

//       if (error.name === "AbortError") {
//         throw new APIError("Request timeout", 408);
//       }

//       throw new APIError(error.message || "Network request failed", 0, error);
//     } finally {
//       clearTimeout(timeoutId);
//     }
//   }

//   /**
//    * Generate AI summary from PDF
//    *
//    * @param pdfUrl - URL of the uploaded PDF file
//    * @param fileName - Name of the PDF file
//    * @returns Generated summary and formatted title
//    *
//    * @example
//    * ```typescript
//    * const { summary, title } = await api.generate(
//    *   'https://uploadthing.com/f/abc123',
//    *   'my-document.pdf'
//    * );
//    * ```
//    */
//   async generate(
//     pdfUrl: string,
//     fileName: string,
//   ): Promise<GenerateSummaryResponse> {
//     return this.request<GenerateSummaryResponse>(
//       "/api/summaries/generate",
//       {
//         method: "POST",
//         body: JSON.stringify({
//           pdfUrl,
//           fileName,
//         } as GenerateSummaryRequest),
//       },
//       false, // No auth required
//     );
//   }

//   /**
//    * Store generated summary to database
//    *
//    * @param data - Summary data to store
//    * @returns Created summary with ID
//    *
//    * @example
//    * ```typescript
//    * const result = await api.store({
//    *   summary: generatedSummary,
//    *   fileUrl: pdfUrl,
//    *   title: documentTitle,
//    *   fileName: 'document.pdf'
//    * });
//    * console.log('Saved with ID:', result.id);
//    * ```
//    */
//   async store(data: StoreSummaryRequest): Promise<StoreSummaryResponse> {
//     return this.request<StoreSummaryResponse>(
//       "/api/summaries/store",
//       {
//         method: "POST",
//         body: JSON.stringify(data),
//       },
//       true, // Auth required
//     );
//   }

//   /**
//    * Delete a summary by ID
//    *
//    * @param id - Summary ID to delete
//    * @returns Deleted summary ID
//    *
//    * @example
//    * ```typescript
//    * await api.delete(123);
//    * // Manually refresh your list
//    * queryClient.invalidateQueries(['summaries']);
//    * ```
//    */
//   async delete(id: number): Promise<DeleteSummaryResponse> {
//     return this.request<DeleteSummaryResponse>(
//       `/api/summaries/${id}`,
//       {
//         method: "DELETE",
//       },
//       true, // Auth required
//     );
//   }

//   // ============================================
//   // Future endpoints (you can add these)
//   // ============================================

//   /**
//    * Get all summaries for the authenticated user
//    * Note: This endpoint doesn't exist yet, but you can create it
//    */
//   async getAll(page: number = 1, pageSize: number = 10): Promise<Summary[]> {
//     return this.request<Summary[]>(
//       `/api/summaries?page=${page}&pageSize=${pageSize}`,
//       {
//         method: "GET",
//       },
//       true,
//     );
//   }

//   /**
//    * Get a single summary by ID
//    * Note: This endpoint doesn't exist yet, but you can create it
//    */
//   async getById(id: number): Promise<Summary> {
//     return this.request<Summary>(
//       `/api/summaries/${id}`,
//       {
//         method: "GET",
//       },
//       true,
//     );
//   }
// }

// // ============================================
// // Custom Error Class
// // ============================================

// export class APIError extends Error {
//   statusCode: number;
//   error?: any;

//   constructor(message: string, statusCode: number = 500, error?: any) {
//     super(message);
//     this.name = "APIError";
//     this.statusCode = statusCode;
//     this.error = error;
//   }

//   get isUnauthorized() {
//     return this.statusCode === 401;
//   }

//   get isBadRequest() {
//     return this.statusCode === 400;
//   }

//   get isNotFound() {
//     return this.statusCode === 404;
//   }

//   get isServerError() {
//     return this.statusCode >= 500;
//   }
// }

// // ============================================
// // React Hook Example
// // ============================================

// /**
//  * Example React Hook for using the API client
//  *
//  * ```typescript
//  * import { useAuth } from '@clerk/clerk-expo';
//  * import { SummariesAPI } from './api-client';
//  *
//  * export function useSummariesAPI() {
//  *   const { getToken } = useAuth();
//  *   const api = new SummariesAPI(API_URL, getToken);
//  *   return api;
//  * }
//  *
//  * // Usage in component
//  * function MyComponent() {
//  *   const api = useSummariesAPI();
//  *
//  *   const handleGenerate = async () => {
//  *     try {
//  *       const result = await api.generate(pdfUrl, fileName);
//  *       console.log(result.summary);
//  *     } catch (error) {
//  *       if (error instanceof APIError) {
//  *         if (error.isUnauthorized) {
//  *           // Redirect to login
//  *         } else {
//  *           Alert.alert('Error', error.message);
//  *         }
//  *       }
//  *     }
//  *   };
//  * }
//  * ```
//  */

// // ============================================
// // React Query Integration Example
// // ============================================

// /**
//  * Example with @tanstack/react-query
//  *
//  * ```typescript
//  * import { useMutation, useQueryClient } from '@tanstack/react-query';
//  *
//  * export function useGenerateSummary() {
//  *   const api = useSummariesAPI();
//  *
//  *   return useMutation({
//  *     mutationFn: ({ pdfUrl, fileName }: GenerateSummaryRequest) =>
//  *       api.generate(pdfUrl, fileName),
//  *     onError: (error: APIError) => {
//  *       Alert.alert('Error', error.message);
//  *     },
//  *   });
//  * }
//  *
//  * export function useStoreSummary() {
//  *   const api = useSummariesAPI();
//  *   const queryClient = useQueryClient();
//  *
//  *   return useMutation({
//  *     mutationFn: (data: StoreSummaryRequest) => api.store(data),
//  *     onSuccess: () => {
//  *       // Invalidate queries to refresh data
//  *       queryClient.invalidateQueries(['summaries']);
//  *     },
//  *   });
//  * }
//  *
//  * export function useDeleteSummary() {
//  *   const api = useSummariesAPI();
//  *   const queryClient = useQueryClient();
//  *
//  *   return useMutation({
//  *     mutationFn: (id: number) => api.delete(id),
//  *     onSuccess: () => {
//  *       queryClient.invalidateQueries(['summaries']);
//  *     },
//  *   });
//  * }
//  *
//  * // Usage in component
//  * function PDFScreen() {
//  *   const generateMutation = useGenerateSummary();
//  *   const storeMutation = useStoreSummary();
//  *
//  *   const handleUpload = async (file) => {
//  *     try {
//  *       // Step 1: Upload file
//  *       const uploadResult = await uploadFile(file);
//  *
//  *       // Step 2: Generate summary
//  *       const { summary, title } = await generateMutation.mutateAsync({
//  *         pdfUrl: uploadResult.url,
//  *         fileName: file.name,
//  *       });
//  *
//  *       // Step 3: Store summary
//  *       const result = await storeMutation.mutateAsync({
//  *         summary,
//  *         fileUrl: uploadResult.url,
//  *         title,
//  *         fileName: file.name,
//  *       });
//  *
//  *       // Navigate to detail
//  *       navigation.navigate('SummaryDetail', { id: result.id });
//  *     } catch (error) {
//  *       console.error(error);
//  *     }
//  *   };
//  *
//  *   return (
//  *     <View>
//  *       <Button
//  *         onPress={handleUpload}
//  *         loading={generateMutation.isLoading || storeMutation.isLoading}
//  *       />
//  *     </View>
//  *   );
//  * }
//  * ```
//  */

// export default SummariesAPI;
