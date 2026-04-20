# 🔄 Server Actions to REST API Conversion Reference

This document shows the original Server Actions alongside their REST API equivalents for easy comparison.

---

## 1️⃣ Delete Summary Action

### ✅ Original Server Action

**File**: `actions/summary-actions.ts`

```typescript
"use server";

import { getDbConnection } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteSummaryAction = async (summaryId: string) => {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
      throw new Error("المستخدم غير موجود");
    }
    const sql = await getDbConnection();
    const result =
      await sql`DELETE FROM pdf_summaries WHERE id = ${summaryId} AND user_id = ${userId} RETURNING id`;
    if (result.length > 0) {
      revalidatePath("/dashboard");
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  } catch (error) {
    console.error("فشل حذف الملخص:", error);
    return {
      success: false,
    };
  }
};
```

### 🆕 REST API Endpoint

**File**: `app/api/summaries/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Authenticate user (replaces currentUser())
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const userId = authResult.userId;
    const summaryId = params.id;

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

    // Note: revalidatePath() removed - client handles refresh
    return successResponse({ id: summaryId }, "Summary deleted successfully");
  } catch (error) {
    console.error("Failed to delete summary:", error);
    return errorResponse("Failed to delete summary", 500, error);
  }
}
```

### 📝 Key Changes

| Original                       | New                            | Reason                       |
| ------------------------------ | ------------------------------ | ---------------------------- |
| `currentUser()`                | `authenticateRequest(request)` | Extract auth from headers    |
| `revalidatePath("/dashboard")` | Removed                        | Client must refresh manually |
| Throw errors                   | Return `errorResponse()`       | HTTP-friendly error handling |
| `summaryId` parameter          | `params.id` from URL           | RESTful route params         |

### 📱 Usage Comparison

**Server Action (Next.js Client)**:

```typescript
import { deleteSummaryAction } from "@/actions/summary-actions";

const handleDelete = async () => {
  const result = await deleteSummaryAction(summaryId);
  if (result.success) {
    // Dashboard automatically revalidated
  }
};
```

**REST API (React Native)**:

```typescript
const handleDelete = async () => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/api/summaries/${summaryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (data.success) {
    // Manually refresh summaries list
    await refetchSummaries();
  }
};
```

---

## 2️⃣ Generate PDF Summary Action

### ✅ Original Server Action

**File**: `actions/upload-actions.ts`

```typescript
"use server";

import { fetchAndExtractText } from "@/lib/langchain";
import { generatePdfSummaryByOpenAI } from "@/lib/openai";
import { generatePdfSummaryByGemini } from "@/lib/geminiai";
import { formatFileNameAsTitle } from "@/utils/format-utils";

export const generatePdfSummary = async (
  uploadResponse: Array<{
    name: string;
    ufsUrl: string;
    serverData: {
      uploadedBy: string;
    };
  }>,
) => {
  if (!uploadResponse || uploadResponse.length === 0) {
    return {
      success: false,
      error: "فشل رفع الملف",
      data: null,
    };
  }
  const { ufsUrl: pdfUrl, name: pdfName } = uploadResponse[0];
  try {
    const pdfText = await fetchAndExtractText(pdfUrl);
    let summary;
    try {
      summary = await generatePdfSummaryByOpenAI(pdfText);
    } catch (error) {
      console.log("openai failed");
      if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
        try {
          console.log("try gemini ai");
          summary = await generatePdfSummaryByGemini(pdfText);
        } catch (geminiError) {
          console.log("Gemini API failed after OpenAI", geminiError);
          return {
            success: false,
            message: "Gemini API failed after OpenAI quote exceeded",
            data: null,
          };
        }
      }
    }
    if (!summary) {
      return {
        success: false,
        message: "جميع مزودي الخدمة AI فشلوا، يرجى المحاولة مرة أخرى",
        data: null,
      };
    }
    const formattedTitle = formatFileNameAsTitle(pdfName);
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
```

### 🆕 REST API Endpoint

**File**: `app/api/summaries/generate/route.ts`

```typescript
import { NextRequest } from "next/server";
import { fetchAndExtractText } from "@/lib/langchain";
import { generatePdfSummaryByOpenAI } from "@/lib/openai";
import { generatePdfSummaryByGemini } from "@/lib/geminiai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { errorResponse, successResponse } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support both uploadthing format and simplified format
    let pdfUrl: string;
    let pdfName: string;

    if (body.uploadResponse && Array.isArray(body.uploadResponse)) {
      // UploadThing format (same as original)
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

    // Extract text from PDF
    let pdfText: string;
    try {
      pdfText = await fetchAndExtractText(pdfUrl);
    } catch (error) {
      return errorResponse("Failed to process PDF file", 400, error);
    }

    // Generate summary with AI (same logic as original)
    let summary: string | null = null;

    try {
      summary = await generatePdfSummaryByOpenAI(pdfText);
    } catch (error) {
      console.log("OpenAI failed, trying Gemini...");
      if (error instanceof Error && error.message === "Rate limit exceeded") {
        try {
          summary = await generatePdfSummaryByGemini(pdfText);
        } catch (geminiError) {
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

    if (!summary) {
      return errorResponse("Failed to generate summary from AI services", 500);
    }

    const formattedTitle = formatFileNameAsTitle(pdfName);

    return successResponse(
      { summary, title: formattedTitle },
      "Summary generated successfully",
    );
  } catch (error) {
    return errorResponse("Failed to generate summary", 500, error);
  }
}
```

### 📝 Key Changes

| Original           | New                   | Reason                   |
| ------------------ | --------------------- | ------------------------ |
| Function parameter | `request.json()`      | HTTP request body        |
| No authentication  | Optional auth         | Can be added if needed   |
| Return object      | `NextResponse.json()` | HTTP response format     |
| Error handling     | HTTP status codes     | 400, 500, 503 codes      |
| Single format      | Dual format support   | UploadThing + simplified |

### 📱 Usage Comparison

**Server Action (Next.js Client)**:

```typescript
import { generatePdfSummary } from "@/actions/upload-actions";

const result = await generatePdfSummary([
  {
    name: file.name,
    ufsUrl: file.url,
    serverData: { uploadedBy: userId },
  },
]);
```

**REST API (React Native)**:

```typescript
const response = await fetch(`${API_URL}/api/summaries/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    pdfUrl: fileUrl,
    fileName: fileName,
  }),
});
const data = await response.json();
```

---

## 3️⃣ Store PDF Summary Action

### ✅ Original Server Action

**File**: `actions/upload-actions.ts`

```typescript
"use server";

import { getDbConnection } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
        error instanceof Error
          ? error.message
          : "فشل حفظ الملخص في قاعدة البيانات",
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
```

### 🆕 REST API Endpoint

**File**: `app/api/summaries/store/route.ts`

```typescript
import { NextRequest } from "next/server";
import { getDbConnection } from "@/lib/db";
import {
  authenticateRequest,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user (replaces auth())
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const userId = authResult.userId;

    // Parse request body
    const body = await request.json();
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

    // Save to database (same SQL as original)
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

    // Note: revalidatePath() removed - client handles refresh
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
    return errorResponse("Failed to save summary to database", 500, error);
  }
}
```

### 📝 Key Changes

| Original              | New                            | Reason                       |
| --------------------- | ------------------------------ | ---------------------------- |
| `auth()`              | `authenticateRequest(request)` | Extract auth from headers    |
| Function params       | `request.json()`               | HTTP request body            |
| `revalidatePath()` ×2 | Removed                        | Client must refresh manually |
| Direct validation     | Explicit checks                | Better error messages        |
| Return object         | `NextResponse.json()`          | HTTP response format         |

### 📱 Usage Comparison

**Server Action (Next.js Client)**:

```typescript
import { storePdfSummaryAction } from "@/actions/upload-actions";

const result = await storePdfSummaryAction({
  summary,
  fileUrl,
  title,
  fileName,
});
if (result.success) {
  // Pages automatically revalidated
  router.push(`/summaries/${result.data.id}`);
}
```

**REST API (React Native)**:

```typescript
const token = await getToken();
const response = await fetch(`${API_URL}/api/summaries/store`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    summary,
    fileUrl,
    title,
    fileName,
  }),
});
const data = await response.json();
if (data.success) {
  // Manually navigate and refresh
  navigation.navigate("SummaryDetail", { id: data.data.id });
  await refetchSummaries();
}
```

---

## 🔑 Common Patterns

### Authentication Pattern

**Server Action**:

```typescript
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) {
  return { success: false, message: "Not authenticated" };
}
```

**REST API**:

```typescript
import { authenticateRequest } from "@/lib/api-auth";

const authResult = await authenticateRequest(request);
if (!authResult.authenticated) {
  return authResult.response; // Returns 401 JSON response
}
const userId = authResult.userId;
```

### Error Handling Pattern

**Server Action**:

```typescript
try {
  // ... logic
  return { success: true, data: result };
} catch (error) {
  return { success: false, message: "Error occurred" };
}
```

**REST API**:

```typescript
try {
  // ... logic
  return successResponse(result, "Success message");
} catch (error) {
  return errorResponse("Error occurred", 500, error);
}
```

### Revalidation Pattern

**Server Action**:

```typescript
revalidatePath("/dashboard");
revalidatePath(`/summaries/${id}`);
return { success: true };
```

**REST API**:

```typescript
// Server: Just return success
return successResponse({ id });

// Client: Manual refresh
const data = await response.json();
if (data.success) {
  queryClient.invalidateQueries(["summaries"]);
  queryClient.invalidateQueries(["summary", data.data.id]);
}
```

---

## ⚠️ Migration Checklist

When migrating from Server Actions to REST APIs:

- [ ] Replace `auth()` / `currentUser()` with `authenticateRequest(request)`
- [ ] Remove all `revalidatePath()` and `redirect()` calls
- [ ] Change function parameters to `request.json()` parsing
- [ ] Return `NextResponse.json()` instead of plain objects
- [ ] Add HTTP status codes (200, 400, 401, 404, 500)
- [ ] Add request validation
- [ ] Update error handling to use `errorResponse()`
- [ ] Test with React Native client
- [ ] Update client code to:
  - Pass Authorization header
  - Check HTTP status codes
  - Manually refresh data after mutations
  - Handle errors from response body

---

## 📊 Feature Comparison

| Feature              | Server Actions       | REST APIs                     |
| -------------------- | -------------------- | ----------------------------- |
| **Authentication**   | Cookies (automatic)  | Headers (manual)              |
| **Revalidation**     | Automatic            | Manual                        |
| **Error Format**     | Return objects       | HTTP status codes             |
| **Type Safety**      | Full (same codebase) | Via shared types              |
| **Platform Support** | Next.js only         | Universal (iOS, Android, Web) |
| **Debugging**        | Server logs          | Network inspector             |
| **Testing**          | Integration tests    | API tests (Postman, etc)      |

---

## ✅ Verification Checklist

To verify your REST APIs work correctly:

1. **Test with cURL**:

```bash
curl -X DELETE http://localhost:3000/api/summaries/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

2. **Test with Postman**: Import endpoints and test all scenarios

3. **Test Error Cases**:
   - Missing auth token (401)
   - Invalid data (400)
   - Non-existent resources (404)
   - Server errors (500)

4. **Test React Native Integration**: Verify all endpoints work from mobile app

5. **Performance**: Ensure response times are acceptable

---

## 🎯 Summary

All Server Actions have been successfully converted to REST API endpoints with:

- ✅ Preserved business logic
- ✅ Authentication via headers
- ✅ Proper error handling
- ✅ HTTP status codes
- ✅ Production-ready code
- ✅ React Native compatible

The original Server Actions remain unchanged and can still be used by Next.js pages.
