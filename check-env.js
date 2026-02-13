#!/usr/bin/env node

/**
 * Environment Variables Health Check
 * Run this script to verify all required environment variables are set
 */

const requiredEnvVars = {
  'Appwrite Configuration': [
    'NEXT_PUBLIC_APPWRITE_ENDPOINT',
    'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
  ],
  'Appwrite Database': [
    'NEXT_PUBLIC_DATABASE_ID',
    'NEXT_PUBLIC_PRODUCTS_COLLECTION_ID',
    'NEXT_PUBLIC_ORDERS_COLLECTION_ID',
    'NEXT_PUBLIC_USERS_COLLECTION_ID',
    'NEXT_PUBLIC_DROPS_COLLECTION_ID',
    'NEXT_PUBLIC_NOTIFY_COLLECTION_ID',
    'NEXT_PUBLIC_COMMUNITY_COLLECTION_ID',
  ],
  'Appwrite Storage': [
    'NEXT_PUBLIC_STORAGE_BUCKET_ID',
  ],
  'Cloudinary': [
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ],
  'SendGrid': [
    'SENDGRID_API_KEY',
    'SENDGRID_FROM_EMAIL',
  ],
};

const fs = require('fs');
const path = require('path');

console.log('\n🔍 DROP FIT - Environment Variables Health Check\n');
console.log('═'.repeat(60));

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('\n❌ ERROR: .env.local file not found!\n');
  console.log('📝 To fix this:');
  console.log('   1. Copy .env.example to .env.local');
  console.log('   2. Fill in your actual Appwrite credentials\n');
  console.log('   $ cp .env.example .env.local\n');
  process.exit(1);
}

console.log('\n✅ .env.local file found\n');

// Load environment variables
require('dotenv').config({ path: envPath });

let allValid = true;
let warnings = [];

// Check each category
for (const [category, vars] of Object.entries(requiredEnvVars)) {
  console.log(`\n📦 ${category}`);
  console.log('─'.repeat(60));
  
  for (const varName of vars) {
    const value = process.env[varName];
    const isSet = value && value !== `your_${varName.toLowerCase()}`;
    
    if (isSet) {
      // Mask sensitive values
      let displayValue = value;
      if (varName.includes('API_KEY') || varName.includes('API_SECRET')) {
        displayValue = value.substring(0, 8) + '***';
      } else if (value.length > 40) {
        displayValue = value.substring(0, 37) + '...';
      }
      
      console.log(`  ✅ ${varName}: ${displayValue}`);
    } else {
      console.log(`  ❌ ${varName}: NOT SET`);
      allValid = false;
    }
  }
}

// Additional checks
console.log('\n\n🔧 Additional Checks');
console.log('─'.repeat(60));

// Check endpoint format
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
if (endpoint) {
  if (endpoint.includes('/v1')) {
    console.log('  ✅ Appwrite endpoint includes /v1');
  } else {
    console.log('  ⚠️  Warning: Endpoint should end with /v1');
    console.log(`     Current: ${endpoint}`);
    console.log(`     Should be: ${endpoint}/v1`);
    warnings.push('Appwrite endpoint missing /v1');
  }
}

// Check project ID format
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
if (projectId && projectId.length > 0 && projectId !== 'your_project_id') {
  console.log('  ✅ Project ID is set');
} else {
  console.log('  ❌ Project ID needs to be updated');
  allValid = false;
}

// Check bucket ID
const bucketId = process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID;
if (bucketId && bucketId !== 'product_images_bucket_id') {
  console.log('  ✅ Storage bucket ID is set');
} else {
  console.log('  ⚠️  Storage bucket ID needs to be updated');
  warnings.push('Storage bucket ID not configured');
}

// Summary
console.log('\n\n📊 Summary');
console.log('═'.repeat(60));

if (allValid && warnings.length === 0) {
  console.log('\n✨ All environment variables are properly configured!\n');
  console.log('🚀 You can now run: npm run dev\n');
} else {
  console.log('\n⚠️  Some environment variables need attention:\n');
  
  if (!allValid) {
    console.log('❌ Missing required variables - check items marked with ❌ above\n');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach(w => console.log(`   - ${w}`));
    console.log();
  }
  
  console.log('📖 Steps to fix:');
  console.log('   1. Open .env.local in your editor');
  console.log('   2. Update the variables marked as NOT SET or with warnings');
  console.log('   3. Get the correct values from:');
  console.log('      - Appwrite Console: https://cloud.appwrite.io');
  console.log('      - Cloudinary Dashboard: https://cloudinary.com/console');
  console.log('      - SendGrid Dashboard: https://app.sendgrid.com/settings/api_keys');
  console.log('   4. Run this script again to verify\n');
  console.log('💡 For Appwrite setup help, see: APPWRITE_SETUP.md\n');
}

// Exit with appropriate code
process.exit(allValid ? 0 : 1);
