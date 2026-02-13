# Troubleshooting 401 Unauthorized Error

## Issue
You're seeing a **401 Unauthorized** error from Appwrite, which means the server is rejecting your requests due to authentication/permission issues.

## Quick Fixes

### 1. Check Environment Variables

**Verify `.env.local` exists:**
```bash
# In your project root
ls -la .env.local
```

If the file doesn't exist:
```bash
# Copy from example
cp .env.example .env.local
```

**Edit `.env.local` with your actual Appwrite credentials:**
```bash
# Open in your editor
code .env.local
# or
nano .env.local
```

### 2. Verify Appwrite Storage Bucket Permissions

The 401 error is likely caused by incorrect Storage bucket permissions. Here's how to fix it:

#### Step 1: Go to Appwrite Console
1. Navigate to https://cloud.appwrite.io
2. Select your project
3. Go to **Storage** → **Buckets**
4. Click on your `product_images` bucket

#### Step 2: Set Correct Permissions
Click on **Settings** tab, then **Permissions**:

**READ Permissions:**
- Add `Role: Any` (allows public read access)
  - Click "+ Add Role"
  - Select "Any"
  - Check "Read"
  - Click "Add"

**CREATE Permissions:**
- Add `Role: Users` (allows authenticated users to upload)
  - Click "+ Add Role"
  - Select "Users"
  - Check "Create"
  - Click "Add"

**UPDATE & DELETE Permissions:**
- Add `Role: Users` (allows authenticated users to manage)
  - Select "Users"
  - Check "Update" and "Delete"

#### Step 3: File Settings
Still in bucket **Settings**:
- **Maximum file size:** 5242880 (5MB in bytes)
- **Allowed file extensions:** jpg, jpeg, png, gif, webp
- **Compression:** Enabled (optional)
- **Encryption:** Enabled (recommended)

### 3. Verify Collection Permissions

If you're getting 401 on product data, check collection permissions:

1. Go to **Databases** → Your Database → **Collections**
2. For each collection (products, orders, users, etc.):

**Products Collection Permissions:**
- **READ:** `Role: Any` (public can view products)
- **CREATE:** `Role: Users` or admin role
- **UPDATE:** `Role: Users` or admin role
- **DELETE:** `Role: Users` or admin role

### 4. Check API Endpoint

Ensure your `.env.local` has the correct endpoint:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
```

**NOT:**
- ❌ `https://cloud.appwrite.io` (missing /v1)
- ❌ `http://localhost:80/v1` (wrong endpoint)

### 5. Verify Project ID

Your project ID must match exactly:
```env
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_actual_project_id
```

To find your Project ID:
1. Go to Appwrite Console
2. Click on your project
3. Go to **Settings**
4. Copy the **Project ID**

### 6. Admin User Role Setup

If you need admin access, ensure the user has the correct role:

1. Go to **Databases** → **Users Collection**
2. Find your user document
3. Ensure the `role` attribute is set to `admin`

Alternatively, run the admin creation script:
```bash
cd appwrite-mcp-server
npm run create-admin
```

### 7. Restart Development Server

After making changes to `.env.local`:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## Testing the Fix

### Test 1: Check if Appwrite is Accessible
```bash
curl https://cloud.appwrite.io/v1/health
```
Should return: `{"status":"OK"}`

### Test 2: Verify Your Project ID
Open browser console and check:
```javascript
console.log(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
```

### Test 3: Try Uploading an Image
1. Go to `/admin/products`
2. Click "+ Add Product"
3. Try uploading an image
4. Check browser console for errors

## Common Causes & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| 401 on image upload | Bucket permissions wrong | Set bucket READ to `Any`, CREATE to `Users` |
| 401 on product fetch | Collection permissions wrong | Set products READ to `Any` |
| 401 on product create | Not authenticated | Login first, or set CREATE to `Users` |
| 401 everywhere | Wrong endpoint/project ID | Check `.env.local` values |
| Session expired | Old authentication token | Logout and login again |

## Still Not Working?

### Enable Debug Mode

Add to your `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

Then check browser console for detailed error messages.

### Check Appwrite Console Logs

1. Go to Appwrite Console
2. Click **Logs** in the sidebar
3. Look for 401 errors
4. Check the error details

### Verify Network Request

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Filter by "appwrite"
4. Look for red (failed) requests
5. Click on them to see:
   - Request headers
   - Response
   - Error message

## Contact Support

If the issue persists:
1. Check Appwrite Discord: https://appwrite.io/discord
2. GitHub Issues: https://github.com/appwrite/appwrite/issues
3. Appwrite Docs: https://appwrite.io/docs

## Summary Checklist

- [ ] `.env.local` file exists with correct values
- [ ] Appwrite endpoint is `https://cloud.appwrite.io/v1`
- [ ] Project ID matches Appwrite console
- [ ] Storage bucket has public READ permissions
- [ ] Storage bucket has Users CREATE permissions
- [ ] Products collection has public READ permissions
- [ ] User is logged in (for protected operations)
- [ ] Development server restarted after `.env.local` changes
- [ ] Browser cache cleared
- [ ] Unsplash images domain added to `next.config.js` ✅ (already fixed)

---

**Next.js Image Configuration:** ✅ **FIXED** - Unsplash domain added to `next.config.js`

**Appwrite 401 Error:** Follow the steps above to configure permissions correctly.
