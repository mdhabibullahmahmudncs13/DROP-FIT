# Appwrite API Key Setup

The checkout functionality now requires a server-side Appwrite API key to create orders securely.

## Steps to Add API Key:

1. **Go to your Appwrite Console:**
   - Visit: https://cloud.appwrite.io/console
   - Select your project: **DROP FIT** (ID: 698243f1003e10aaa472)

2. **Create an API Key:**
   - Click on **Overview** or **Settings** in the left sidebar
   - Navigate to **API Keys** section
   - Click **Create API Key**
   - Name: `Server API Key` or `Next.js Server`
   - Scopes: Select the following:
     - ✅ `databases.read`
     - ✅ `databases.write`
   - Click **Create**
   - **Copy the generated API key** (you won't see it again!)

3. **Add to Environment Variables:**
   
   Open your `.env.local` file and add:
   ```
   APPWRITE_API_KEY=your_api_key_here
   ```

4. **Restart the Development Server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

## Why This Change?

Previously, the checkout was trying to use client-side authentication on the server, which caused permission errors. Now:
- ✅ Client sends order data to API route
- ✅ Server uses API key for privileged operations
- ✅ More secure and reliable order creation

## Security Note:
- ⚠️ Never commit `.env.local` to Git
- ⚠️ The API key should only be used server-side (never expose to client)
- ✅ API keys are already in `.gitignore`
