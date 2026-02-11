# Appwrite Setup Guide for Drop Fit

This guide walks you through setting up Appwrite as the backend for the Drop Fit e-commerce platform.

## Prerequisites

- An Appwrite Cloud account or self-hosted Appwrite instance
- Basic understanding of NoSQL databases

## Step 1: Create an Appwrite Project

1. Go to [Appwrite Console](https://cloud.appwrite.io/)
2. Click **"Create Project"**
3. Name your project: **Drop Fit**
4. Note your **Project ID** - you'll need this for `.env.local`

## Step 2: Create the Database

1. In your Appwrite project, navigate to **Databases** in the left sidebar
2. Click **"Create Database"**
3. Name: **drop_fit_db**
4. Copy the **Database ID** that's generated

## Step 3: Create Collections

You need to create 6 collections. For each collection:

### 3.1 Products Collection

**Collection Name:** `products`

**Attributes:**

| Attribute Name | Type | Size | Required | Array | Default |
|---------------|------|------|----------|-------|---------|
| `title` | String | 255 | Yes | No | - |
| `slug` | String | 255 | Yes | No | - |
| `description` | String | 5000 | Yes | No | - |
| `price` | Integer | - | Yes | No | - |
| `images` | String | 500 | Yes | Yes | - |
| `sizes` | String | 10 | Yes | Yes | - |
| `stock` | Integer | - | Yes | No | - |
| `collection` | String | 50 | Yes | No | - |
| `featured` | Boolean | - | No | No | false |
| `is_drop` | Boolean | - | No | No | false |
| `drop_id` | String | 255 | No | No | - |

**Indexes:**
- `slug` - Key: `slug`, Type: Unique, Attributes: `slug`
- `collection` - Key: `collection`, Type: Key, Attributes: `collection`
- `featured` - Key: `featured`, Type: Key, Attributes: `featured`
- `is_drop` - Key: `is_drop`, Type: Key, Attributes: `is_drop`

**Permissions:**
- Read access: Any
- Create/Update/Delete: Users (or disable for API-only access)

---

### 3.2 Orders Collection

**Collection Name:** `orders`

**Attributes:**

| Attribute Name | Type | Size | Required | Array | Default |
|---------------|------|------|----------|-------|---------|
| `user_id` | String | 255 | Yes | No | - |
| `items` | String | 10000 | Yes | No | - |
| `total_amount` | Integer | - | Yes | No | - |
| `status` | String | 50 | Yes | No | pending |
| `shipping_name` | String | 255 | Yes | No | - |
| `shipping_phone` | String | 50 | Yes | No | - |
| `shipping_address` | String | 500 | Yes | No | - |
| `shipping_city` | String | 100 | Yes | No | - |
| `payment_method` | String | 50 | Yes | No | cod |
| `notes` | String | 1000 | No | No | - |
| `created_at` | DateTime | - | Yes | No | - |

**Indexes:**
- `user_id` - Key: `user_id`, Type: Key, Attributes: `user_id`
- `status` - Key: `status`, Type: Key, Attributes: `status`
- `created_at` - Key: `created_at`, Type: Key, Attributes: `created_at`, Order: DESC

**Permissions:**
- Read access: Users (users can read their own orders)
- Create: Users
- Update: Users (for admins only in production)

**Note:** The `items` field stores a JSON string array of OrderItem objects. Each OrderItem contains: `product_id`, `title`, `size`, `qty`, and `price`.

---

### 3.3 Users Collection

**Collection Name:** `users`

**Attributes:**

| Attribute Name | Type | Size | Required | Array | Default |
|---------------|------|------|----------|-------|---------|
| `user_id` | String | 255 | Yes | No | - |
| `name` | String | 255 | Yes | No | - |
| `email` | String | 255 | Yes | No | - |
| `phone` | String | 50 | Yes | No | - |
| `address` | String | 500 | No | No | - |
| `city` | String | 100 | No | No | - |
| `postalCode` | String | 20 | No | No | - |
| `role` | String | 20 | Yes | No | user |

**Indexes:**
- `user_id` - Key: `user_id`, Type: Unique, Attributes: `user_id`
- `email` - Key: `email`, Type: Key, Attributes: `email`
- `role` - Key: `role`, Type: Key, Attributes: `role`

**Permissions:**
- Read: Users (users can read their own profile)
- Create: Users
- Update: Users (users can update their own profile)

---

### 3.4 Drops Collection

**Collection Name:** `drops`

**Attributes:**

| Attribute Name | Type | Size | Required | Array | Default |
|---------------|------|------|----------|-------|---------|
| `name` | String | 255 | Yes | No | - |
| `description` | String | 2000 | Yes | No | - |
| `launch_date` | DateTime | - | Yes | No | - |
| `image_url` | String | 500 | Yes | No | - |
| `status` | String | 50 | Yes | No | upcoming |

**Indexes:**
- `status` - Key: `status`, Type: Key, Attributes: `status`
- `launch_date` - Key: `launch_date`, Type: Key, Attributes: `launch_date`

**Permissions:**
- Read access: Any
- Create/Update: API only (or admin users)

---

### 3.5 Notify Me Collection

**Collection Name:** `notify_me`

**Attributes:**

| Attribute Name | Type | Size | Required | Array | Default |
|---------------|------|------|----------|-------|---------|
| `drop_id` | String | 255 | Yes | No | - |
| `email` | String | 255 | Yes | No | - |
| `name` | String | 255 | No | No | - |
| `created_at` | DateTime | - | Yes | No | - |

**Indexes:**
- `drop_id` - Key: `drop_id`, Type: Key, Attributes: `drop_id`
- `email` - Key: `email`, Type: Key, Attributes: `email`

**Permissions:**
- Read: API only
- Create: Any (to allow anonymous signups)

---

### 3.6 Community Posts Collection

**Collection Name:** `community_posts`

**Attributes:**

| Attribute Name | Type | Size | Required | Array | Default |
|---------------|------|------|----------|-------|---------|
| `user_id` | String | 255 | Yes | No | - |
| `username` | String | 255 | Yes | No | - |
| `image_url` | String | 500 | Yes | No | - |
| `caption` | String | 1000 | No | No | - |
| `created_at` | DateTime | - | Yes | No | - |

**Indexes:**
- `user_id` - Key: `user_id`, Type: Key, Attributes: `user_id`
- `created_at` - Key: `created_at`, Type: Key, Attributes: `created_at`, Order: DESC

**Permissions:**
- Read access: Any
- Create: Users
- Delete: Users (own posts only) or Admin

---

## Step 4: Configure Storage

1. Navigate to **Storage** in the left sidebar
2. Click **"Create Bucket"**
3. Bucket Name: **product_images**
4. Copy the **Bucket ID**

**Bucket Settings:**
- Maximum File Size: 5 MB (or adjust as needed)
- Allowed File Extensions: `jpg`, `jpeg`, `png`, `webp`
- Compression: Enable (recommended)
- Encryption: Enable (recommended)

**Permissions:**
- Read access: Any (public read)
- Create: Users or API only
- Update/Delete: API only

---

## Step 5: Configure Authentication

1. Navigate to **Auth** in the left sidebar
2. Click **"Settings"**

**Enable Authentication Methods:**
- ✅ Email/Password

**Session Settings:**
- Session Length: 365 days (or as preferred)
- Security: Enable rate limiting

**Email Templates (Optional):**
Customize the verification and password reset email templates if desired.

---

## Step 6: Update Environment Variables

Copy all the IDs you collected and update your `.env.local` file:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_actual_project_id

# Appwrite Database IDs
NEXT_PUBLIC_DATABASE_ID=your_database_id
NEXT_PUBLIC_PRODUCTS_COLLECTION_ID=products_collection_id
NEXT_PUBLIC_ORDERS_COLLECTION_ID=orders_collection_id
NEXT_PUBLIC_USERS_COLLECTION_ID=users_collection_id
NEXT_PUBLIC_DROPS_COLLECTION_ID=drops_collection_id
NEXT_PUBLIC_NOTIFY_COLLECTION_ID=notify_collection_id
NEXT_PUBLIC_COMMUNITY_COLLECTION_ID=community_collection_id

# Appwrite Storage
NEXT_PUBLIC_STORAGE_BUCKET_ID=product_images_bucket_id

# Cloudinary Configuration (for community uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SendGrid Configuration (for emails)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@dropfit.com
```

---

## Step 7: Seed Sample Data (Optional)

To test the platform, you can manually add some sample data:

### Sample Product

```json
{
  "title": "Naruto Hokage Edition Tee",
  "slug": "naruto-hokage-tee",
  "description": "Premium cotton t-shirt featuring the iconic Hokage symbol. Perfect for any Naruto fan.",
  "price": 2499,
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "sizes": ["S", "M", "L", "XL"],
  "stock": 50,
  "collection": "anime",
  "featured": true,
  "is_drop": false,
  "drop_id": null
}
```

### Sample Drop

```json
{
  "name": "Attack on Titan Limited Edition",
  "description": "Exclusive collection featuring the Survey Corps emblem. Limited to 100 pieces.",
  "launch_date": "2026-02-15T18:00:00.000Z",
  "image_url": "https://example.com/drop-banner.jpg",
  "status": "upcoming"
}
```

---

## Step 8: Verify Setup

1. Restart your Next.js dev server: `npm run dev`
2. Check the console for any Appwrite connection errors
3. Try to:
   - Browse products
   - Sign up for a new account
   - Add items to cart
   - View drops

---

## Common Issues & Solutions

### Issue: "Project with the requested ID could not be found"
**Solution:** Double-check that `NEXT_PUBLIC_APPWRITE_PROJECT_ID` in `.env.local` matches your actual Appwrite Project ID.

### Issue: "Collection not found"
**Solution:** Verify all collection IDs are correctly copied to `.env.local`. Collection IDs are case-sensitive.

### Issue: "Insufficient permissions"
**Solution:** Check the permissions settings for each collection. Ensure "Any" read access is enabled for public data (products, drops).

### Issue: Images not loading
**Solution:** 
1. Verify the bucket ID is correct
2. Check bucket permissions allow public read access
3. Ensure image URLs are valid

---

## Production Considerations

### Security

1. **API Keys:** Never expose API keys in client-side code
2. **Permissions:** Review and tighten permissions for production
3. **Rate Limiting:** Enable Appwrite's rate limiting features
4. **CORS:** Configure allowed origins in Appwrite settings

### Performance

1. **Indexes:** Ensure all frequently queried fields have indexes
2. **Pagination:** Implement pagination for large collections
3. **Caching:** Consider caching frequently accessed data

### Backup

1. Enable automated backups in Appwrite Cloud
2. Export data regularly for self-hosted instances
3. Document your database schema and relationships

---

## Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord Community](https://appwrite.io/discord)
- [Appwrite GitHub](https://github.com/appwrite/appwrite)

---

## Support

If you encounter issues:
1. Check the Appwrite console logs
2. Review the browser console for errors
3. Verify all environment variables are set correctly
4. Consult the Appwrite documentation
5. Ask in the Appwrite Discord community

---

**Last Updated:** February 3, 2026
