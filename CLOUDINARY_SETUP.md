# Cloudinary Setup for Community Posts

The community posts feature requires Cloudinary for image uploads. Follow these steps to set it up:

## 1. Create a Free Cloudinary Account

1. Go to https://cloudinary.com/users/register_free
2. Sign up with your email
3. Verify your email address

## 2. Get Your Credentials

After logging in to Cloudinary:

1. Go to Dashboard (https://console.cloudinary.com/)
2. You'll see your account details at the top:
   - **Cloud Name** (e.g., "dqxyz123")
   - **API Key** (e.g., "123456789012345")
   - **API Secret** (click the eye icon to reveal)

## 3. Add to Environment Variables

Open your `.env.local` file and update these values:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Replace:**
- `your_cloud_name_here` with your actual Cloud Name
- `your_api_key_here` with your actual API Key
- `your_api_secret_here` with your actual API Secret

## 4. Restart the Development Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## 5. Test Upload

1. Go to the Community page
2. Try uploading a post with an image
3. It should now work!

## Free Tier Limits

Cloudinary's free tier includes:
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ 25,000 transformations/month
- ✅ Perfect for development and small sites!

## Optional: Create Upload Preset

For better organization:

1. In Cloudinary console, go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Name it: `dropfit_community`
5. Set **Signing Mode** to "Signed"
6. Save

Then update your `.env.local`:
```bash
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dropfit_community
```

## Troubleshooting

**Error: "Unknown API key"**
- Make sure you copied the API key correctly (no extra spaces)
- Ensure you restarted the dev server after adding credentials

**Error: "Invalid signature"**
- Check that API Secret is correct
- Make sure there are no quotes around the values in .env.local

**Error: "Resource not found"**
- Verify Cloud Name is spelled correctly
