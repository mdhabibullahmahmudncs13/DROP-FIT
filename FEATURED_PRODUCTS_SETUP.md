# Featured Products Setup

This guide explains how to set up and use the featured products functionality.

## What is Featured Products?

Featured products are special products that are highlighted on the homepage. This allows you to showcase selected items to visitors when they first land on your site.

## Setup Instructions

### Step 1: Add the Database Attribute

Before you can mark products as featured, you need to add the `featured` attribute to your Appwrite Products collection.

**Option A: Using the Script (Recommended)**

Run the migration script:

```bash
node add-featured-attribute.js
```

Make sure you have the following environment variables set:
- `APPWRITE_API_KEY` - Your Appwrite API key with appropriate permissions

**Option B: Manually in Appwrite Console**

1. Go to your Appwrite Console
2. Navigate to Databases → Your Database → Products Collection
3. Go to the "Attributes" tab
4. Click "Add Attribute"
5. Select "Boolean"
6. Set the following:
   - Key: `featured`
   - Required: No (unchecked)
   - Default: `false`
7. Click "Create"

### Step 2: Mark Products as Featured

1. Log in to your admin panel at `/admin`
2. Go to "Products" from the sidebar
3. Create a new product or edit an existing one
4. Check the "⭐ Feature this product on the homepage" checkbox
5. Save the product

### Step 3: View Featured Products

Visit your homepage. Featured products will appear in a dedicated section between the hero and the next drop sections.

## Features

- **Homepage Display**: Featured products are prominently displayed on the homepage
- **Limit**: Up to 6 featured products are shown
- **Easy Management**: Toggle products as featured/unfeatured from the admin panel
- **Responsive Grid**: Products are displayed in a responsive 1-3 column grid

## Tips

- Feature your best-selling or newest products
- Keep the featured products fresh by updating them regularly
- Use featured products to highlight seasonal items or special promotions
- Limit to 6 or fewer products for best visual impact

## Troubleshooting

**Products not showing on homepage?**
- Verify the `featured` attribute exists in your Appwrite collection
- Make sure you've checked the "Feature this product" checkbox and saved
- Check that the products are in stock and properly configured

**Script fails with permission error?**
- Ensure `APPWRITE_API_KEY` is set in your environment variables
- Verify the API key has permission to modify collection attributes
- You can create an API key in Appwrite Console → Overview → API Keys
