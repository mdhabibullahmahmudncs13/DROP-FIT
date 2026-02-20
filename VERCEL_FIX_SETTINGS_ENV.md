# Fix Vercel Build Error - Missing NEXT_PUBLIC_SETTINGS_COLLECTION_ID

## Quick Fix Steps

### 1. Add Environment Variable to Vercel

Go to your Vercel project dashboard and add the missing environment variable:

**Vercel Dashboard URL:** https://vercel.com/[your-username]/[your-project]/settings/environment-variables

**Add the following:**
- **Name:** `NEXT_PUBLIC_SETTINGS_COLLECTION_ID`
- **Value:** `settings`
- **Environment:** Select all (Production, Preview, Development)

Click **Save**

### 2. Redeploy

After adding the environment variable, trigger a new deployment:

**Option A - From Vercel Dashboard:**
1. Go to Deployments tab
2. Click the three dots (...) on the latest deployment
3. Click "Redeploy"

**Option B - Push a New Commit:**
```bash
git add .env.example
git commit -m "Add SETTINGS_COLLECTION_ID to environment variables"
git push origin master
```

### 3. Verify Deployment

Once redeployed, the build should succeed. You can verify by:
1. Checking the deployment logs
2. Visiting your admin settings page: `https://your-domain.vercel.app/admin/settings`

## What Was the Issue?

The new delivery settings feature added a required environment variable `NEXT_PUBLIC_SETTINGS_COLLECTION_ID` that was:
- ✅ Added to local `.env.local` 
- ❌ Missing from Vercel environment variables

This caused the build to fail during the page data collection phase.

## All Required Environment Variables

Make sure all these are set in Vercel:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=698243f1003e10aaa472
NEXT_PUBLIC_DATABASE_ID=69824479002438e26766
NEXT_PUBLIC_PRODUCTS_COLLECTION_ID=products
NEXT_PUBLIC_ORDERS_COLLECTION_ID=orders
NEXT_PUBLIC_USERS_COLLECTION_ID=users
NEXT_PUBLIC_DROPS_COLLECTION_ID=drops
NEXT_PUBLIC_NOTIFY_COLLECTION_ID=notify_me
NEXT_PUBLIC_COMMUNITY_COLLECTION_ID=community_posts
NEXT_PUBLIC_SETTINGS_COLLECTION_ID=settings  ⬅️ NEW - Add this!
NEXT_PUBLIC_STORAGE_BUCKET_ID=product_images
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@dropfit.com
APPWRITE_API_KEY=your_api_key
```

## Prevention

The `.env.example` file has been updated to include this variable, so future deployments will have it documented.
