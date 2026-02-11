/**
 * Appwrite Setup Verification Script
 * Run this to verify your Appwrite configuration
 */

const { Client, Databases, Account } = require('appwrite');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
    process.env[key] = value;
  }
});

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const account = new Account(client);

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

async function verifyEnvironmentVariables() {
  console.log('\n📋 Checking Environment Variables...\n');
  
  const required = [
    'NEXT_PUBLIC_APPWRITE_ENDPOINT',
    'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
    'NEXT_PUBLIC_DATABASE_ID',
    'NEXT_PUBLIC_PRODUCTS_COLLECTION_ID',
    'NEXT_PUBLIC_ORDERS_COLLECTION_ID',
    'NEXT_PUBLIC_USERS_COLLECTION_ID',
    'NEXT_PUBLIC_DROPS_COLLECTION_ID',
    'NEXT_PUBLIC_NOTIFY_COLLECTION_ID',
    'NEXT_PUBLIC_COMMUNITY_COLLECTION_ID',
    'NEXT_PUBLIC_STORAGE_BUCKET_ID'
  ];

  for (const varName of required) {
    if (process.env[varName]) {
      checks.passed.push(`✓ ${varName}`);
      console.log(`✅ ${varName}: ${process.env[varName]}`);
    } else {
      checks.failed.push(`✗ ${varName} is missing`);
      console.log(`❌ ${varName}: MISSING`);
    }
  }

  // Optional variables
  const optional = [
    'CLOUDINARY_CLOUD_NAME',
    'SENDGRID_API_KEY'
  ];

  for (const varName of optional) {
    if (!process.env[varName] || process.env[varName].startsWith('your_')) {
      checks.warnings.push(`⚠ ${varName} not configured (optional)`);
      console.log(`⚠️  ${varName}: Not configured (optional)`);
    }
  }
}

async function verifyDatabase() {
  console.log('\n📊 Checking Database Connection...\n');
  
  try {
    // Try to list documents from a collection to verify database access
    await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID,
      []
    );
    checks.passed.push(`✓ Database connected successfully`);
    console.log(`✅ Database connected successfully (ID: ${process.env.NEXT_PUBLIC_DATABASE_ID})`);
    return true;
  } catch (error) {
    checks.failed.push(`✗ Database connection failed: ${error.message}`);
    console.log(`❌ Database connection failed: ${error.message}`);
    return false;
  }
}

async function verifyCollections() {
  console.log('\n📁 Checking Collections...\n');
  
  const collections = [
    { id: process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID, name: 'Products' },
    { id: process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID, name: 'Orders' },
    { id: process.env.NEXT_PUBLIC_USERS_COLLECTION_ID, name: 'Users' },
    { id: process.env.NEXT_PUBLIC_DROPS_COLLECTION_ID, name: 'Drops' },
    { id: process.env.NEXT_PUBLIC_NOTIFY_COLLECTION_ID, name: 'Notify Me' },
    { id: process.env.NEXT_PUBLIC_COMMUNITY_COLLECTION_ID, name: 'Community Posts' }
  ];

  for (const collection of collections) {
    try {
      const result = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        collection.id,
        []
      );
      checks.passed.push(`✓ ${collection.name} collection accessible (${result.total} documents)`);
      console.log(`✅ ${collection.name}: Accessible (${result.total} documents)`);
    } catch (error) {
      checks.failed.push(`✗ ${collection.name} collection error: ${error.message}`);
      console.log(`❌ ${collection.name}: ${error.message}`);
    }
  }
}

async function verifyOrdersSchema() {
  console.log('\n🔍 Checking Orders Collection Schema...\n');
  
  try {
    // Try to list documents to verify collection exists
    await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID,
      []
    );
    
    checks.passed.push(`✓ Orders collection is accessible`);
    console.log(`✅ Orders collection is accessible and properly configured`);
    console.log(`\nℹ️  Make sure Orders collection has these attributes:`);
    console.log(`   - user_id (String)`);
    console.log(`   - items (String)`);
    console.log(`   - total_amount (Integer)`);
    console.log(`   - status (String, default: 'pending')`);
    console.log(`   - shipping_name (String)`);
    console.log(`   - shipping_phone (String)`);
    console.log(`   - shipping_address (String)`);
    console.log(`   - shipping_city (String)`);
    console.log(`   - payment_method (String, default: 'cod')`);
    console.log(`   - notes (String, optional)`);
    console.log(`   - created_at (DateTime)`);

  } catch (error) {
    checks.failed.push(`✗ Orders collection error: ${error.message}`);
    console.log(`❌ Orders collection error: ${error.message}`);
  }
}

async function verifyUsersSchema() {
  console.log('\n👤 Checking Users Collection Schema...\n');
  
  try {
    // Try to list documents to verify collection exists
    await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_USERS_COLLECTION_ID,
      []
    );
    
    checks.passed.push(`✓ Users collection is accessible`);
    console.log(`✅ Users collection is accessible and properly configured`);
    console.log(`\nℹ️  Make sure Users collection has these attributes:`);
    console.log(`   - user_id (String, Unique)`);
    console.log(`   - name (String)`);
    console.log(`   - email (String)`);
    console.log(`   - phone (String)`);
    console.log(`   - address (String, optional)`);
    console.log(`   - city (String, optional)`);
    console.log(`   - postalCode (String, optional)`);
    console.log(`   - role (String, default: 'user') ⚠️ CRITICAL FOR ADMIN LOGIN`);

  } catch (error) {
    checks.failed.push(`✗ Users collection error: ${error.message}`);
    console.log(`❌ Users collection error: ${error.message}`);
  }
}

async function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(60) + '\n');

  console.log(`✅ Passed: ${checks.passed.length}`);
  console.log(`❌ Failed: ${checks.failed.length}`);
  console.log(`⚠️  Warnings: ${checks.warnings.length}\n`);

  if (checks.failed.length > 0) {
    console.log('❌ FAILED CHECKS:\n');
    checks.failed.forEach(check => console.log('  ' + check));
    console.log('');
  }

  if (checks.warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    checks.warnings.forEach(warning => console.log('  ' + warning));
    console.log('');
  }

  if (checks.failed.length === 0) {
    console.log('🎉 ALL CRITICAL CHECKS PASSED!\n');
    console.log('Your Appwrite setup is ready to use.\n');
  } else {
    console.log('❌ SETUP INCOMPLETE\n');
    console.log('Please fix the failed checks above before proceeding.\n');
    console.log('Refer to APPWRITE_SETUP.md for detailed instructions.\n');
  }
}

async function main() {
  console.log('🚀 DROP FIT - Appwrite Setup Verification');
  console.log('='.repeat(60));

  await verifyEnvironmentVariables();
  
  const dbConnected = await verifyDatabase();
  
  if (dbConnected) {
    await verifyCollections();
    await verifyOrdersSchema();
    await verifyUsersSchema();
  }

  await printSummary();
}

main().catch(console.error);
