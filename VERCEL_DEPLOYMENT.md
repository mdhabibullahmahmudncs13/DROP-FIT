# Vercel Deployment Guide

## Environment Variables Configuration

The build is failing because environment variables are not configured in Vercel. Follow these steps:

### 1. Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all the following variables:

#### Required Variables

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=<your_appwrite_project_id>
NEXT_PUBLIC_DATABASE_ID=<your_database_id>
NEXT_PUBLIC_PRODUCTS_COLLECTION_ID=<products_collection_id>
NEXT_PUBLIC_ORDERS_COLLECTION_ID=<orders_collection_id>
NEXT_PUBLIC_USERS_COLLECTION_ID=<users_collection_id>
NEXT_PUBLIC_DROPS_COLLECTION_ID=<drops_collection_id>
NEXT_PUBLIC_NOTIFY_COLLECTION_ID=<notify_collection_id>
NEXT_PUBLIC_COMMUNITY_COLLECTION_ID=<community_collection_id>
NEXT_PUBLIC_STORAGE_BUCKET_ID=<storage_bucket_id>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your_cloudinary_upload_preset>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
SENDGRID_API_KEY=<your_sendgrid_api_key>
SENDGRID_FROM_EMAIL=<your_verified_sender_email>
```

### 2. Set Environment Scope

For each variable, select the appropriate environments:
- **Production** ✓
- **Preview** ✓ (recommended)
- **Development** ✓ (optional)

### 3. Redeploy

After adding all environment variables:
1. Go to **Deployments**
2. Click on the failed deployment
3. Click **Redeploy**

Or simply push a new commit to trigger a new deployment.

## Getting Your Appwrite IDs

### Project ID
1. Go to [Appwrite Console](https://cloud.appwrite.io/)
2. Open your project
3. Click **Settings** → Copy the **Project ID**

### Database ID
1. In your Appwrite project, go to **Databases**
2. Click on your database
3. Copy the **Database ID** from the URL or settings

### Collection IDs
1. In your database, click on each collection
2. Copy the **Collection ID** for:
   - products
   - orders
   - users
   - drops
   - notify_me
   - community_posts

### Storage Bucket ID
1. Go to **Storage**
2. Click on your bucket
3. Copy the **Bucket ID**

## Cloudinary Configuration

1. Log in to [Cloudinary](https://cloudinary.com/)
2. Dashboard will show:
   - Cloud Name
   - API Key
   - API Secret
3. Create an upload preset:
   - Settings → Upload → Upload presets
   - Create "unsigned" preset
   - Note the preset name

## SendGrid Configuration

1. Log in to [SendGrid](https://sendgrid.com/)
2. Settings → API Keys
3. Create new API key with "Full Access"
4. Verify a sender email in SendGrid

## Troubleshooting

### Build still fails?
- Double-check all environment variables are set correctly
- Ensure there are no trailing spaces in values
- Verify your Appwrite project is accessible
- Check that collection IDs match exactly

### Need to update variables?
- Go to Vercel Settings → Environment Variables
- Edit the variable
- Redeploy your project
