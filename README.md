# Drop Fit - Anime & Series Streetwear E-commerce Platform

A complete Next.js 14 e-commerce platform for anime and series-inspired streetwear. Built with Appwrite as the Backend-as-a-Service (BaaS), featuring Cash on Delivery (COD) payments, real-time stock updates, and a dark-themed modern UI.

## 🎉 Recent Updates (February 2026)

### ✅ Fixed Issues & Improvements

1. **Product Description Field** - Fixed textarea functionality with improved character limit (1000 chars) and resizable input
2. **Price Field Formatting** - Automatic removal of leading zeros with proper number validation
3. **Image Upload to Appwrite Storage** - Full file upload integration with drag-and-drop support, 5MB limit, and multiple image handling
4. **Product Database Upload** - Enhanced validation and error handling for successful product creation
5. **Automatic Delivery Charge Calculation** - Smart delivery pricing based on order total and location
   - Free delivery for orders ≥ ৳2000
   - Base charge: ৳60
   - Remote areas: ৳100
6. **Collection Hero Images** - Beautiful banner images added to Anime and Series collection pages
7. **Improved Cart Summary** - Real-time delivery charge estimates and free delivery notifications

## 🚀 Features

- **Complete E-commerce Functionality**
  - Product catalog with filtering and search
  - Shopping cart with session persistence
  - Cash on Delivery (COD) checkout
  - Order tracking with real-time updates
  - User authentication and profiles
  - **NEW:** File upload for product images with Appwrite Storage integration

- **Limited Drops System**
  - Active and upcoming drops with countdown timers
  - Notify-me email list for upcoming drops
  - Drop-specific product collections

- **Smart Checkout System**
  - **NEW:** Automatic delivery charge calculation
  - Location-based pricing
  - Free delivery threshold notifications
  - Order total breakdown with subtotal, delivery, and total

- **Community Features**
  - User-submitted photos with Cloudinary hosting
  - Community gallery
  - Social media integration

- **Admin Panel**
  - **IMPROVED:** Product management with file uploads
  - **IMPROVED:** Better form validation and error messages
  - Stock management
  - Order processing
  - User management

- **Tech Stack**
  - Next.js 14 (App Router)
  - TypeScript with strict mode
  - Tailwind CSS with custom design system
  - Appwrite (Database, Auth, Storage, Realtime)
  - Cloudinary for community image hosting
  - SendGrid for transactional emails

## 📋 Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ and npm/yarn installed
- An [Appwrite](https://appwrite.io/) account and project
- A [Cloudinary](https://cloudinary.com/) account
- A [SendGrid](https://sendgrid.com/) account with API key

## 🛠️ Installation

### 1. Clone the Repository

```bash
cd "DROP FIT"
npm install
```

### 2. Set Up Appwrite

#### Create an Appwrite Project

1. Go to [Appwrite Console](https://cloud.appwrite.io/)
2. Create a new project named "Drop Fit"
3. Note your Project ID and API Endpoint

#### Create Database and Collections

Create a database named **drop_fit_db** and the following collections:

**Collection: products**
- Attributes:
  - `name` (string, required)
  - `slug` (string, required, unique)
  - `description` (string, required)
  - `price` (integer, required)
  - `images` (string array, required)
  - `sizes` (string array, required)
  - `stock` (integer, required)
  - `collection` (string, required) // anime, series, minimal
  - `featured` (boolean, default: false)
  - `drop_id` (string, optional)
- Indexes:
  - `slug` (unique)
  - `collection`
  - `featured`

**Collection: orders**
- Attributes:
  - `user_id` (string, required)
  - `items` (string, required) // JSON stringified array
  - `total_amount` (integer, required)
  - `shipping_info` (string, required) // JSON stringified object
  - `status` (string, required) // pending, confirmed, shipped, delivered, cancelled
  - `payment_method` (string, required) // cod
  - `created_at` (datetime, required)
- Indexes:
  - `user_id`
  - `status`
  - `created_at`

**Collection: users**
- Attributes:
  - `user_id` (string, required, unique)
  - `name` (string, required)
  - `email` (string, required)
  - `phone` (string, required)
  - `address` (string, optional)
  - `city` (string, optional)
  - `postalCode` (string, optional)
- Indexes:
  - `user_id` (unique)

**Collection: drops**
- Attributes:
  - `name` (string, required)
  - `description` (string, required)
  - `launch_date` (datetime, required)
  - `image_url` (string, required)
  - `status` (string, required) // active, upcoming, ended
- Indexes:
  - `status`
  - `launch_date`

**Collection: notify_me**
- Attributes:
  - `drop_id` (string, required)
  - `email` (string, required)
  - `created_at` (datetime, required)
- Indexes:
  - `drop_id`

**Collection: community_posts**
- Attributes:
  - `user_id` (string, required)
  - `username` (string, required)
  - `image_url` (string, required)
  - `caption` (string, optional)
  - `created_at` (datetime, required)
- Indexes:
  - `user_id`
  - `created_at`

#### Set Up Storage

1. Create a bucket named **product_images**
2. Set permissions to allow:
   - **Public Read Access:** `Role.any()` - Anyone can read
   - **Create:** `Role.users()` - Authenticated users can upload
   - **Update/Delete:** `Role.users()` - Authenticated users can manage their uploads
3. Configure file size limits:
   - **Maximum File Size:** 5MB (recommended)
   - **Allowed File Extensions:** jpg, jpeg, png, gif, webp
4. Note the Bucket ID for environment variables

**Important:** Ensure the bucket has public read access for product images to display correctly on the frontend.

#### Configure Authentication

1. Enable Email/Password authentication
2. Configure email templates (optional)
3. Set session length as desired

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id

# Appwrite Database IDs
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID=products_collection_id
NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=orders_collection_id
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users_collection_id
NEXT_PUBLIC_APPWRITE_DROPS_COLLECTION_ID=drops_collection_id
NEXT_PUBLIC_APPWRITE_NOTIFY_COLLECTION_ID=notify_collection_id
NEXT_PUBLIC_APPWRITE_COMMUNITY_COLLECTION_ID=community_collection_id

# Appwrite Storage
NEXT_PUBLIC_APPWRITE_BUCKET_ID=product_images_bucket_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@dropfit.com
```

**Verify your environment variables:**
```bash
npm run check-env
```

This will verify all required variables are properly set.

### 4. Configure Cloudinary

1. Log in to your Cloudinary account
2. Create an upload preset:
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Create a new unsigned preset
   - Set folder to "dropfit" (optional)
   - Note the preset name for `.env.local`

### 5. Configure SendGrid

1. Create a SendGrid account
2. Generate an API key with full access
3. Verify a sender email address
4. Add the API key and sender email to `.env.local`

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
DROP FIT/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── account/           # Account dashboard, orders, profile
│   │   ├── api/               # API routes (orders, notify, community)
│   │   ├── auth/              # Login and signup pages
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout flow
│   │   ├── collections/       # Collection pages (anime, series, minimal)
│   │   ├── community/         # Community gallery
│   │   ├── drops/             # Limited drops listing
│   │   ├── order-confirmation/ # Order success page
│   │   ├── product/           # Product detail pages
│   │   ├── shop/              # All products page
│   │   ├── track-order/       # Order tracking
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── cart/              # Cart-related components
│   │   ├── checkout/          # Checkout components
│   │   ├── community/         # Community components
│   │   ├── drops/             # Drops components
│   │   ├── layout/            # Header, Footer, Navigation
│   │   ├── product/           # Product components
│   │   └── ui/                # Base UI components
│   ├── context/               # React Context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── CartContext.tsx    # Shopping cart state
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and integrations
│   │   ├── appwrite/          # Appwrite service layer
│   │   │   ├── storage.ts     # 🆕 Storage upload utilities
│   │   │   └── ...
│   │   ├── cloudinary.ts      # Cloudinary integration
│   │   ├── sendgrid.ts        # SendGrid integration
│   │   └── utils.ts           # Helper functions (🆕 delivery calc)
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

### 🆕 New Files Added

- **`src/lib/appwrite/storage.ts`** - Appwrite Storage integration for product image uploads
  - `uploadProductImage(file)` - Upload images to Appwrite Storage bucket
  - `deleteProductImage(fileId)` - Delete images from storage
  - `extractFileIdFromUrl(url)` - Extract file ID from storage URLs

### 🔧 Key Files Modified

- **`src/components/admin/ProductForm.tsx`**
  - Added file upload support with drag-and-drop
  - Fixed price/stock input to remove leading zeros
  - Enhanced description textarea with character counter
  - Better validation and error messages

- **`src/lib/appwrite/products.ts`**
  - Enhanced `createProduct()` with better validation
  - Improved error messages for debugging

- **`src/lib/utils.ts`**
  - Added `calculateDeliveryCharge(subtotal, city)` function
  - Added `calculateOrderTotal(subtotal, city)` function

- **`src/components/checkout/ReviewOrder.tsx`**
  - Added delivery charge breakdown
  - Free delivery notifications
  - Order total calculation with delivery

- **`src/components/cart/CartSummary.tsx`**
  - Estimated delivery charge display
  - Free delivery threshold alerts

- **`src/app/api/orders/route.ts`**
  - Integrated delivery charge calculation
  - Updated order total to include delivery

- **`src/app/collections/[slug]/page.tsx`**
  - Added hero banner images for anime and series
  - Responsive image display with gradient overlays

## 🎨 Design System

### Colors

- **Primary**: `#E63946` (Fire Red)
- **Background**: `#0F0F0F` (Near Black)
- **Surface**: `#1A1A1A` (Dark Gray)
- **Card**: `#0D0D0D` (Darker Gray)
- **Text Primary**: `#FFFFFF` (White)
- **Text Secondary**: `#B0B0B0` (Light Gray)
- **Text Muted**: `#707070` (Gray)
- **Border**: `#2A2A2A` (Dark Border)

### Typography

- Font: Inter (Google Fonts)
- Headings: Bold, various sizes
- Body: Regular, 16px base

## 🔑 Key Features Explained

### Real-time Updates

The platform uses Appwrite Realtime for live updates:
- Stock levels update automatically on product pages
- Order status changes reflect immediately on tracking pages

### Cash on Delivery (COD)

All payments are handled via COD:
- No payment gateway integration required
- Payment collected at delivery time
- Order confirmation emails sent immediately

### Delivery Charge System (NEW)

Smart delivery pricing with automatic calculation:

**Pricing Tiers:**
- **Free Delivery:** Orders ≥ ৳2000
- **Standard Delivery:** ৳60 (Dhaka and nearby areas)
- **Remote Areas:** ৳100 (Sylhet, Chittagong, Khulna, Rajshahi, Rangpur, Barisal, Mymensingh)

**Features:**
- Automatic calculation based on order total
- Location-based pricing
- Real-time free delivery threshold alerts
- Clear breakdown in cart and checkout

**Configuration:**
Edit delivery settings in `src/lib/utils.ts`:
```typescript
// Modify free delivery threshold
if (subtotal >= 2000) { // Change this value

// Modify base delivery charge
const baseCharge = 60; // Change this value

// Add/remove remote areas
const remoteAreas = ['sylhet', 'chittagong', ...]; // Edit this array
```

### Image Management

- **Product Images:** Stored in Appwrite Storage bucket with automatic URL generation
- **Community Uploads:** Handled by Cloudinary for user-generated content
- **File Upload:** Drag-and-drop interface with 5MB limit and format validation
- **Multiple Images:** Support for uploading multiple product images simultaneously

### Email Notifications

SendGrid handles all transactional emails:
- Welcome emails on signup
- Order confirmation emails
- Drop notification emails

## 🧪 Testing

### Manual Testing Checklist

**User Flow:**
- [ ] User signup and login
- [ ] Browse products and collections
- [ ] View anime collection with hero banner
- [ ] View series collection with hero banner
- [ ] Add products to cart
- [ ] Update cart quantities
- [ ] View delivery charge estimate in cart
- [ ] Check free delivery notification (if applicable)

**Checkout Flow:**
- [ ] Proceed to checkout
- [ ] Fill shipping information
- [ ] Review order with delivery charge breakdown
- [ ] Verify delivery charge calculation is correct
- [ ] Place order
- [ ] Receive order confirmation

**Admin Features:**
- [ ] **NEW:** Upload product images via file upload
- [ ] **NEW:** Test drag-and-drop image upload
- [ ] **FIXED:** Enter product description (multi-line)
- [ ] **FIXED:** Enter price without leading zeros
- [ ] Create new product with all validations
- [ ] View validation errors for missing fields
- [ ] Edit existing product
- [ ] Delete product
- [ ] Manage stock levels

**Other Features:**
- [ ] Track order
- [ ] View order history
- [ ] Update profile
- [ ] Community post upload
- [ ] Drop countdown timers

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted with Docker

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API endpoint | Yes |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project ID | Yes |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID` | Database ID | Yes |
| `NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID` | Products collection ID | Yes |
| `NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID` | Orders collection ID | Yes |
| `NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID` | Users collection ID | Yes |
| `NEXT_PUBLIC_APPWRITE_DROPS_COLLECTION_ID` | Drops collection ID | Yes |
| `NEXT_PUBLIC_APPWRITE_NOTIFY_COLLECTION_ID` | Notify Me collection ID | Yes |
| `NEXT_PUBLIC_APPWRITE_COMMUNITY_COLLECTION_ID` | Community collection ID | Yes |
| `NEXT_PUBLIC_APPWRITE_BUCKET_ID` | Storage bucket ID | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `SENDGRID_API_KEY` | SendGrid API key | Yes |
| `SENDGRID_FROM_EMAIL` | Sender email address | Yes |

## 🐛 Troubleshooting

### Quick Diagnostics

**Check your environment setup:**
```bash
npm run check-env
```

**For 401 Unauthorized errors, see:** [TROUBLESHOOTING_401_ERROR.md](TROUBLESHOOTING_401_ERROR.md)

### Common Issues

**Build Errors**
- Ensure all environment variables are set
- Check that TypeScript types are correct
- Verify Node.js version (18+)

**Appwrite Connection Issues**
- Verify Project ID and endpoint
- Check collection IDs match your Appwrite setup
- Ensure proper permissions on collections

**Image Upload Issues**
- **FIXED:** Image upload now uses Appwrite Storage directly
- Verify `NEXT_PUBLIC_STORAGE_BUCKET_ID` is set correctly
- Ensure bucket permissions are set to public read
- Check file size doesn't exceed 5MB
- Verify file is a valid image format

**Product Creation Issues**
- **FIXED:** Enhanced validation now provides clear error messages
- Ensure all required fields are filled (title, description, price, images, sizes)
- Verify at least one image is uploaded
- Check that at least one size is selected
- Ensure stock and price are positive numbers

**Delivery Charge Not Showing**
- **FIXED:** Automatic delivery charge now calculates based on order total and city
- Free delivery applies automatically for orders ≥ ৳2000
- Remote area surcharge added automatically for specific cities

**Email Not Sending**
- Verify SendGrid API key
- Check sender email is verified
- Review SendGrid logs

### Fixed Issues (February 2026)

1. ✅ **Description Field** - Was using `resize-none`, changed to `resize-vertical` and added character counter
2. ✅ **Price Input Leading Zero** - Added automatic formatting to strip leading zeros on input and blur
3. ✅ **Image Upload** - Created `src/lib/appwrite/storage.ts` with `uploadProductImage()` function
4. ✅ **Product Upload** - Enhanced error handling and validation in `createProduct()`
5. ✅ **Delivery Charge** - Added `calculateDeliveryCharge()` and `calculateOrderTotal()` utilities
6. ✅ **Collection Images** - Added hero banners to anime and series collection pages

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub or contact support@dropfit.com.

---

**Built with ❤️ for the anime and series streetwear community**
