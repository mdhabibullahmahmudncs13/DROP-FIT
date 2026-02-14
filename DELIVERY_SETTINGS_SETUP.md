# Delivery Settings Collection Setup

## Overview
This guide will help you set up the Settings collection in Appwrite to enable manual delivery charge configuration from the admin panel.

## Collection Setup

### 1. Create the Settings Collection

1. Log in to your Appwrite Console
2. Navigate to your project's Database
3. Click on "Add Collection"
4. Configure the collection:
   - **Collection ID**: `settings` (or use a custom ID)
   - **Collection Name**: Settings
   - **Enabled**: Yes

### 2. Add Collection Attributes

Add the following attributes to the Settings collection:

| Attribute Key | Type | Size | Required | Default | Array |
|--------------|------|------|----------|---------|-------|
| `base_charge` | Integer | - | Yes | `60` | No |
| `free_delivery_threshold` | Integer | - | Yes | `2000` | No |
| `remote_area_charge` | Integer | - | Yes | `40` | No |
| `remote_areas` | String | 1000 | No | - | Yes |

### 3. Set Collection Permissions

Configure the following permissions:

**Read Permissions:**
- Role: `any` (Allow all users to read settings)

**Create Permissions:**
- Role: `users` (Only for initial setup)

**Update Permissions:**
- Add your admin user ID or role
- Example: `user:[YOUR_ADMIN_USER_ID]`

**Delete Permissions:**
- Add your admin user ID or role
- Example: `user:[YOUR_ADMIN_USER_ID]`

### 4. Add Environment Variable

Add the following environment variable to your `.env.local` file:

```env
NEXT_PUBLIC_SETTINGS_COLLECTION_ID=settings
```

If you used a custom collection ID in Appwrite, use that value instead of `settings`.

### 5. Update Vercel Environment Variables (if deployed)

If your app is deployed on Vercel:

1. Go to your Vercel project
2. Navigate to Settings → Environment Variables
3. Add the new variable:
   - **Name**: `NEXT_PUBLIC_SETTINGS_COLLECTION_ID`
   - **Value**: `settings` (or your custom collection ID)
   - **Environment**: Production, Preview, Development

## Initial Setup

### Option 1: Using the Admin Panel (Recommended)

1. Navigate to `/admin/settings` in your admin panel
2. The system will automatically create the default settings document when you first save
3. Configure your desired delivery charges:
   - Base Delivery Charge
   - Free Delivery Threshold
   - Remote Area Additional Charge
   - Remote Areas (comma-separated city names)
4. Click "Save Settings"

### Option 2: Manual Creation in Appwrite Console

1. Go to your Settings collection in Appwrite Console
2. Click "Add Document"
3. Set **Document ID** to: `delivery_settings`
4. Add the following data:
   ```json
   {
     "base_charge": 60,
     "free_delivery_threshold": 2000,
     "remote_area_charge": 40,
     "remote_areas": [
       "sylhet",
       "chittagong",
       "khulna",
       "rajshahi",
       "rangpur",
       "barisal",
       "mymensingh"
     ]
   }
   ```
5. Click "Create"

## How It Works

### Delivery Charge Calculation

The system calculates delivery charges based on the configured settings:

1. **Free Delivery**: Orders above the free delivery threshold get free shipping
2. **Regular Areas**: Base delivery charge applies
3. **Remote Areas**: Base charge + remote area charge applies
4. **City Matching**: The system checks if the delivery city contains any of the remote area names (case-insensitive)

### Example Scenarios

With default settings:
- Base Charge: ৳60
- Free Delivery Threshold: ৳2000
- Remote Area Charge: ৳40
- Remote Areas: sylhet, chittagong, etc.

**Scenario 1**: Order for ৳1500 to Dhaka
- Delivery Charge: ৳60 (base charge)
- Total: ৳1560

**Scenario 2**: Order for ৳1500 to Chittagong
- Delivery Charge: ৳100 (base ৳60 + remote ৳40)
- Total: ৳1600

**Scenario 3**: Order for ৳2500 to any location
- Delivery Charge: ৳0 (free delivery)
- Total: ৳2500

## Admin Features

### Access Settings Page

Navigate to **Admin Panel → Settings** to configure:

1. **Base Delivery Charge**: Standard delivery fee for regular areas
2. **Free Delivery Threshold**: Minimum order amount for free delivery
3. **Remote Area Additional Charge**: Extra fee added to base charge for remote areas
4. **Remote Areas**: List of cities/areas considered remote (comma-separated)

### Preview Calculation

The settings page shows a live preview of how delivery charges will be calculated with your current settings.

### Reset to Default

Click "Reset to Default" to restore the original default values for all settings.

## Troubleshooting

### Settings not loading

1. Verify the collection ID matches your environment variable
2. Check that the collection has proper read permissions (`any`)
3. Ensure the document ID is exactly `delivery_settings`

### Cannot save settings

1. Verify you have update permissions on the collection
2. Check the Appwrite console for any error messages
3. Ensure all required attributes are present

### Delivery charges not updating

1. Settings are cached for 5 minutes - wait a few minutes or refresh the page
2. Verify the settings were saved successfully in the admin panel
3. Check the browser console for any errors

## Notes

- Settings are cached for 5 minutes to reduce API calls
- Changes take effect immediately for new calculations
- Active shopping carts may need to be refreshed to see updated charges
- The system falls back to default settings if the collection is not found

## Support

If you encounter any issues, check:
1. Appwrite Console logs
2. Browser developer console
3. Network tab for API errors
4. Collection permissions and attribute configuration
