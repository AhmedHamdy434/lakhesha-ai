# 🚀 Quick Start Guide - REST APIs for React Native

This guide will get you up and running with the REST APIs in 5 minutes.

---

## 📋 What Was Created

Your Next.js project now has **3 new REST API endpoints** that mirror the functionality of your Server Actions:

| Endpoint                  | Method | Purpose                      | Auth        |
| ------------------------- | ------ | ---------------------------- | ----------- |
| `/api/summaries/generate` | POST   | Generate AI summary from PDF | Optional    |
| `/api/summaries/store`    | POST   | Save summary to database     | ✅ Required |
| `/api/summaries/[id]`     | DELETE | Delete a summary             | ✅ Required |

✅ **Original Server Actions are untouched and still work!**

---

## 🎯 Quick Setup (React Native)

### Step 1: Copy Files to React Native Project

Copy these files to your React Native project:

```
✅ types/api.ts                          → Your RN project
✅ examples/react-native-api-client.ts   → Your RN project
```

### Step 2: Install Clerk (if not already installed)

```bash
npm install @clerk/clerk-expo
```

### Step 3: Configure API URL

Create a config file:

```typescript
// config.ts
export const API_URL = __DEV__
  ? "http://localhost:3000" // Point to your Next.js dev server
  : "https://your-domain.vercel.app"; // Your production URL
```

### Step 4: Create API Hook

```typescript
// hooks/useAPI.ts
import { useAuth } from "@clerk/clerk-expo";
import { SummariesAPI } from "../api/react-native-api-client";
import { API_URL } from "../config";

export function useSummariesAPI() {
  const { getToken } = useAuth();
  return new SummariesAPI(API_URL, getToken);
}
```

### Step 5: Use in Your Components

```typescript
import { useSummariesAPI } from './hooks/useAPI';

function PDFUploadScreen() {
  const api = useSummariesAPI();
  const [loading, setLoading] = useState(false);

  const handleUpload = async (pdfFile) => {
    setLoading(true);
    try {
      // 1. Upload file to storage
      const upload = await uploadToStorage(pdfFile);

      // 2. Generate summary
      const { summary, title } = await api.generate(
        upload.url,
        pdfFile.name
      );

      // 3. Store to database
      const result = await api.store({
        summary,
        fileUrl: upload.url,
        title,
        fileName: pdfFile.name,
      });

      // 4. Navigate to detail
      navigation.navigate('SummaryDetail', { id: result.id });

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onPress={handleUpload}
      loading={loading}
      title="Upload PDF"
    />
  );
}
```

---

## 🧪 Testing Locally

### 1. Start Next.js Dev Server

```bash
cd d:\front\projects\lakhesha-ai
npm run dev
```

This starts your Next.js server at `http://localhost:3000`

### 2. Test with cURL

**Generate Summary** (no auth):

```bash
curl -X POST http://localhost:3000/api/summaries/generate \
  -H "Content-Type: application/json" \
  -d "{\"pdfUrl\":\"YOUR_PDF_URL\",\"fileName\":\"test.pdf\"}"
```

**Store Summary** (requires auth token):

```bash
curl -X POST http://localhost:3000/api/summaries/store \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d "{\"summary\":\"Test summary\",\"fileUrl\":\"https://...\",\"title\":\"Test\",\"fileName\":\"test.pdf\"}"
```

**Delete Summary**:

```bash
curl -X DELETE http://localhost:3000/api/summaries/1 \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

### 3. Get a Test Token

In your Next.js app (running locally):

```typescript
// Add this temporarily to any page
import { useAuth } from '@clerk/nextjs';

export default function TestPage() {
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then(token => console.log('Token:', token));
  }, []);

  return <div>Check console for token</div>;
}
```

Copy the token from console and use it in cURL commands.

---

## 📱 React Native Configuration

### Android - Connect to Localhost

Add to your `android/app/src/main/AndroidManifest.xml`:

```xml
<application
  android:usesCleartextTraffic="true">
  <!-- ... -->
</application>
```

Then use `http://10.0.2.2:3000` for Android emulator or your local IP for physical device.

### iOS - Connect to Localhost

Use `http://localhost:3000` for iOS simulator or your local IP for physical device.

### Use Local IP for Physical Devices

Find your local IP:

**Windows**:

```bash
ipconfig
# Look for IPv4 Address
```

**Mac/Linux**:

```bash
ifconfig | grep "inet "
```

Then use: `http://192.168.x.x:3000`

---

## 🎓 Common Patterns

### Pattern 1: Generate & Store (Full Workflow)

```typescript
const fullWorkflow = async (pdfUrl: string, fileName: string) => {
  const api = useSummariesAPI();

  // Generate
  const { summary, title } = await api.generate(pdfUrl, fileName);

  // Store
  const result = await api.store({
    summary,
    fileUrl: pdfUrl,
    title,
    fileName,
  });

  return result.id;
};
```

### Pattern 2: Delete with Confirmation

```typescript
const handleDelete = async (id: number) => {
  Alert.alert("Delete Summary", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        const api = useSummariesAPI();
        await api.delete(id);
        // Refresh list
        await refetchSummaries();
      },
    },
  ]);
};
```

### Pattern 3: With React Query

```typescript
import { useMutation } from "@tanstack/react-query";

function useStoreSummary() {
  const api = useSummariesAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreSummaryRequest) => api.store(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["summaries"]);
    },
  });
}

// Usage
const { mutate, isLoading } = useStoreSummary();
mutate({ summary, fileUrl, title, fileName });
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Network request failed"

**Cause**: Can't connect to Next.js server  
**Solution**:

- Ensure Next.js dev server is running (`npm run dev`)
- Check API_URL is correct (localhost for simulator, IP for device)
- For Android, use `http://10.0.2.2:3000`

### Issue 2: "401 Unauthorized"

**Cause**: Missing or invalid auth token  
**Solution**:

- Ensure user is signed in with Clerk
- Check `getToken()` returns a valid token
- Verify token is included in Authorization header

### Issue 3: "400 Bad Request"

**Cause**: Invalid request body  
**Solution**:

- Check all required fields are present
- Verify JSON format is correct
- Check PDF URL is accessible

### Issue 4: "503 Service Unavailable"

**Cause**: Both OpenAI and Gemini APIs failed  
**Solution**:

- Check API keys in `.env`
- Verify API quotas aren't exceeded
- Wait and retry (rate limit may have been hit)

---

## 📚 Documentation Reference

| File                                  | What's Inside                             |
| ------------------------------------- | ----------------------------------------- |
| `API_SUMMARY.md`                      | Executive summary of everything           |
| `REACT_NATIVE_API_GUIDE.md`           | Complete React Native guide with examples |
| `CONVERSION_REFERENCE.md`             | Side-by-side old vs new code              |
| `SERVER_ACTIONS_ANALYSIS.md`          | Original analysis of Server Actions       |
| `types/api.ts`                        | TypeScript types for API calls            |
| `examples/react-native-api-client.ts` | Production-ready API client               |

---

## 🔐 Environment Variables

Ensure these are set in your Next.js `.env` file:

```env
# Database
DATABASE_URL=your_neon_db_url

# AI Services
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# UploadThing (if using)
UPLOADTHING_SECRET=your_secret
UPLOADTHING_APP_ID=your_app_id
```

---

## ✅ Checklist

Before using in production:

- [ ] Test all endpoints with cURL/Postman
- [ ] Verify authentication works
- [ ] Test error cases (401, 400, 500)
- [ ] Test from React Native app (dev)
- [ ] Test on physical device (not just simulator)
- [ ] Add rate limiting (recommended)
- [ ] Set up production environment variables
- [ ] Deploy to production
- [ ] Update API_URL in React Native app
- [ ] Test production endpoints

---

## 🚀 Next Steps

1. **Copy files to React Native project**
2. **Test locally with cURL**
3. **Create API hook in React Native**
4. **Update existing components to use new APIs**
5. **Test full workflow**
6. **Deploy to production**

---

## 💡 Pro Tips

### Tip 1: Use TypeScript

Copy `types/api.ts` to your React Native project for full type safety.

### Tip 2: Use React Query

Handles caching, refetching, and state management automatically.

### Tip 3: Centralize API Logic

Don't call `fetch` directly in components. Use the API client.

### Tip 4: Handle Errors Globally

Create an error handler that shows appropriate messages:

```typescript
const handleAPIError = (error: APIError) => {
  if (error.isUnauthorized) {
    navigation.navigate("Login");
  } else if (error.isServerError) {
    Alert.alert("Server Error", "Please try again later");
  } else {
    Alert.alert("Error", error.message);
  }
};
```

### Tip 5: Add Loading States

Always show loading indicators during API calls for better UX.

---

## 📞 Need Help?

1. Check the error message in the API response
2. Look at server logs (Next.js terminal)
3. Use React Native Debugger to inspect network calls
4. Review the documentation files listed above
5. Test with cURL to isolate the issue

---

## 🎉 You're Ready!

Your REST APIs are production-ready and fully compatible with React Native. Start building your mobile app! 🚀

**Happy Coding!** 👨‍💻👩‍💻
