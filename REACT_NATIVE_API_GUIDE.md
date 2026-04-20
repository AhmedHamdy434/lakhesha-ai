# 📱 REST API Documentation for React Native

This document provides complete API documentation for consuming the Next.js backend from React Native.

---

## 🔐 Authentication

All protected endpoints require a Clerk session token in the Authorization header:

```typescript
headers: {
  'Authorization': `Bearer ${clerkToken}`,
  'Content-Type': 'application/json',
}
```

### Getting Clerk Token in React Native

```typescript
import { useAuth } from "@clerk/clerk-expo";

function MyComponent() {
  const { getToken } = useAuth();

  const callApi = async () => {
    const token = await getToken();
    const response = await fetch(`${API_URL}/api/summaries`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
```

---

## 📚 API Endpoints

### Base URL

```
Production: https://your-domain.com
Development: http://localhost:3000
```

---

## 1️⃣ Generate PDF Summary

**Endpoint**: `POST /api/summaries/generate`

**Authentication**: ❌ Not required (optional)

**Description**: Generate an AI-powered summary from a PDF file using OpenAI (with Gemini fallback)

### Request

```typescript
POST /api/summaries/generate
Content-Type: application/json

{
  "pdfUrl": "https://uploadthing.com/f/abc123",
  "fileName": "my-document.pdf"
}
```

Or UploadThing format:

```typescript
{
  "uploadResponse": [{
    "name": "document.pdf",
    "ufsUrl": "https://uploadthing.com/f/abc123",
    "serverData": {
      "uploadedBy": "user_123"
    }
  }]
}
```

### Response

**Success (200)**:

```json
{
  "success": true,
  "message": "Summary generated successfully",
  "data": {
    "summary": "# Document Summary\n\nThis is a comprehensive summary...",
    "title": "My Document"
  }
}
```

**Error (400)**:

```json
{
  "success": false,
  "error": "Failed to process PDF file",
  "message": "Invalid request. Provide either 'uploadResponse' or 'pdfUrl' and 'fileName'"
}
```

**Error (503)**:

```json
{
  "success": false,
  "error": "All AI services failed",
  "message": "All AI services failed. Please try again later."
}
```

### React Native Example

```typescript
const generateSummary = async (pdfUrl: string, fileName: string) => {
  try {
    const response = await fetch(`${API_URL}/api/summaries/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pdfUrl,
        fileName,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to generate summary");
    }

    return {
      summary: data.data.summary,
      title: data.data.title,
    };
  } catch (error) {
    console.error("Generate summary error:", error);
    throw error;
  }
};
```

---

## 2️⃣ Store PDF Summary

**Endpoint**: `POST /api/summaries/store`

**Authentication**: ✅ Required

**Description**: Save a generated summary to the database for the authenticated user

### Request

```typescript
POST /api/summaries/store
Content-Type: application/json
Authorization: Bearer <clerk_token>

{
  "summary": "# Document Summary\n\nGenerated summary text...",
  "fileUrl": "https://uploadthing.com/f/abc123",
  "title": "My Document",
  "fileName": "my-document.pdf"
}
```

### Response

**Success (200)**:

```json
{
  "success": true,
  "message": "Summary saved successfully",
  "data": {
    "id": 42,
    "title": "My Document",
    "fileName": "my-document.pdf",
    "createdAt": "2026-01-31T08:00:00.000Z"
  }
}
```

**Error (401)**:

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Authentication required. Please provide a valid session token."
}
```

**Error (400)**:

```json
{
  "success": false,
  "error": "Validation error",
  "message": "Summary text is required"
}
```

### React Native Example

```typescript
import { useAuth } from "@clerk/clerk-expo";

const storeSummary = async (summaryData: {
  summary: string;
  fileUrl: string;
  title: string;
  fileName: string;
}) => {
  const { getToken } = useAuth();
  const token = await getToken();

  try {
    const response = await fetch(`${API_URL}/api/summaries/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(summaryData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to store summary");
    }

    return data.data; // { id, title, fileName, createdAt }
  } catch (error) {
    console.error("Store summary error:", error);
    throw error;
  }
};
```

---

## 3️⃣ Delete Summary

**Endpoint**: `DELETE /api/summaries/[id]`

**Authentication**: ✅ Required

**Description**: Delete a PDF summary by ID (only if owned by the authenticated user)

### Request

```typescript
DELETE / api / summaries / 42;
Authorization: Bearer<clerk_token>;
```

### Response

**Success (200)**:

```json
{
  "success": true,
  "message": "Summary deleted successfully",
  "data": {
    "id": "42"
  }
}
```

**Error (404)**:

```json
{
  "success": false,
  "error": "Summary not found or you don't have permission to delete it",
  "message": "Summary not found or you don't have permission to delete it"
}
```

**Error (401)**:

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Authentication required. Please provide a valid session token."
}
```

### React Native Example

```typescript
import { useAuth } from "@clerk/clerk-expo";

const deleteSummary = async (summaryId: number) => {
  const { getToken } = useAuth();
  const token = await getToken();

  try {
    const response = await fetch(`${API_URL}/api/summaries/${summaryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to delete summary");
    }

    // Manually refresh your summaries list here
    // (no automatic revalidation in React Native)

    return true;
  } catch (error) {
    console.error("Delete summary error:", error);
    throw error;
  }
};
```

---

## 🔄 Complete Workflow Example

Here's a complete example of the PDF summary workflow in React Native:

```typescript
import { useAuth } from '@clerk/clerk-expo';
import { useState } from 'react';

const API_URL = 'https://your-domain.com';

function PDFSummaryScreen() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePDFUpload = async (pdfFile: any) => {
    setLoading(true);

    try {
      // Step 1: Upload PDF to UploadThing or your storage
      const uploadedFile = await uploadToStorage(pdfFile);

      // Step 2: Generate summary
      const generateResponse = await fetch(`${API_URL}/api/summaries/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfUrl: uploadedFile.url,
          fileName: uploadedFile.name,
        }),
      });

      const generateData = await generateResponse.json();

      if (!generateData.success) {
        throw new Error(generateData.message);
      }

      const { summary, title } = generateData.data;

      // Step 3: Store summary to database
      const token = await getToken();
      const storeResponse = await fetch(`${API_URL}/api/summaries/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          summary,
          fileUrl: uploadedFile.url,
          title,
          fileName: uploadedFile.name,
        }),
      });

      const storeData = await storeResponse.json();

      if (!storeData.success) {
        throw new Error(storeData.message);
      }

      // Success! Navigate to summary detail
      const summaryId = storeData.data.id;
      navigation.navigate('SummaryDetail', { id: summaryId });

    } catch (error) {
      console.error('PDF summary workflow error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your UI here
  );
}
```

---

## ⚠️ Breaking Changes from Server Actions

### 1. No Automatic Revalidation

**Server Action**: `revalidatePath()` automatically refreshes data
**REST API**: You must manually refetch data after mutations

```typescript
// After deleting a summary
await deleteSummary(id);
// Manually refresh your list
await refetchSummaries();
```

### 2. Authentication via Headers

**Server Action**: Uses cookies automatically
**REST API**: Must pass token in Authorization header

```typescript
headers: {
  'Authorization': `Bearer ${await getToken()}`,
}
```

### 3. Error Handling

**Server Action**: Returns `{ success: boolean, ... }`
**REST API**: Use HTTP status codes + response body

```typescript
if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message);
}
```

---

## 🚀 Best Practices

### 1. Environment Variables

```typescript
// .env
API_URL=https://your-domain.com
```

### 2. API Client Wrapper

```typescript
class APIClient {
  constructor(
    private baseURL: string,
    private getToken: () => Promise<string>,
  ) {}

  async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getToken();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "API request failed");
    }

    return data.data;
  }
}
```

### 3. React Query Integration

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useSaveSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => storeSummary(data),
    onSuccess: () => {
      // Invalidate and refetch summaries
      queryClient.invalidateQueries(["summaries"]);
    },
  });
}
```

---

## 📊 Response Status Codes

| Code | Meaning             | Action                          |
| ---- | ------------------- | ------------------------------- |
| 200  | Success             | Process data                    |
| 400  | Bad Request         | Check request body/params       |
| 401  | Unauthorized        | Re-authenticate user            |
| 404  | Not Found           | Resource doesn't exist          |
| 500  | Server Error        | Retry or show error             |
| 503  | Service Unavailable | AI services failed, retry later |

---

## 🔧 TypeScript Types

```typescript
// api-types.ts
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface Summary {
  id: number;
  title: string;
  fileName: string;
  summary: string;
  fileUrl: string;
  createdAt: string;
}

export interface GenerateSummaryRequest {
  pdfUrl: string;
  fileName: string;
}

export interface GenerateSummaryResponse {
  summary: string;
  title: string;
}

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
```

---

## 🐛 Debugging Tips

### 1. Log Request/Response

```typescript
console.log('Request:', { endpoint, body, headers });
const response = await fetch(...);
const data = await response.json();
console.log('Response:', data);
```

### 2. Check Network Tab

Use React Native Debugger or Flipper to inspect network requests

### 3. Verify Token

```typescript
const token = await getToken();
console.log("Token:", token ? "Present" : "Missing");
```

---

## 📞 Support

For issues or questions:

1. Check error messages in API responses
2. Verify authentication token is valid
3. Ensure request body matches expected format
4. Check server logs for detailed error info
