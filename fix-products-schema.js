#!/usr/bin/env node

/**
 * Fix Products Collection Schema
 * 
 * This script fixes the 'images' and 'sizes' attributes in the products collection
 * to be string arrays instead of single strings.
 * 
 * Usage:
 *   node fix-products-schema.js
 */

const { Client, Databases, ID } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Configuration
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID || process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID;

// You need an API key with Database permissions
const API_KEY = process.argv[2];

if (!API_KEY) {
  console.error('\n❌ Error: API Key required\n');
  console.log('Usage: node fix-products-schema.js YOUR_API_KEY\n');
  console.log('Get your API key from:');
  console.log('  Appwrite Console → Your Project → Settings → API Keys → Create API Key\n');
  console.log('Give it these permissions:');
  console.log('  ✓ databases.read');
  console.log('  ✓ databases.write');
  console.log('  ✓ collections.read');
  console.log('  ✓ collections.write');
  console.log('  ✓ attributes.read');
  console.log('  ✓ attributes.write\n');
  process.exit(1);
}

console.log('\n🔧 DROP FIT - Products Collection Schema Fixer\n');
console.log('═'.repeat(60));

// Validate environment variables
if (!ENDPOINT || !PROJECT_ID || !DATABASE_ID || !COLLECTION_ID) {
  console.error('\n❌ Missing required environment variables!\n');
  console.log('Required in .env.local:');
  console.log('  - NEXT_PUBLIC_APPWRITE_ENDPOINT');
  console.log('  - NEXT_PUBLIC_APPWRITE_PROJECT_ID');
  console.log('  - NEXT_PUBLIC_DATABASE_ID (or NEXT_PUBLIC_APPWRITE_DATABASE_ID)');
  console.log('  - NEXT_PUBLIC_PRODUCTS_COLLECTION_ID (or NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID)\n');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function deleteAttribute(attributeKey) {
  try {
    console.log(`\n📋 Deleting old '${attributeKey}' attribute...`);
    await databases.deleteAttribute(DATABASE_ID, COLLECTION_ID, attributeKey);
    console.log(`✅ Deleted '${attributeKey}' attribute`);
    return true;
  } catch (error) {
    if (error.code === 404) {
      console.log(`⚠️  Attribute '${attributeKey}' not found (might already be deleted)`);
      return true;
    }
    console.error(`❌ Error deleting '${attributeKey}':`, error.message);
    return false;
  }
}

async function createStringArrayAttribute(key, size, required = true) {
  try {
    console.log(`\n📋 Creating '${key}' as string array (size: ${size})...`);
    
    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      key,
      size,
      required,
      undefined, // default value
      true // array = true
    );
    
    console.log(`✅ Created '${key}' attribute as string array`);
    
    // Wait for attribute to be available
    console.log(`⏳ Waiting for '${key}' to become available...`);
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      try {
        const attr = await databases.getAttribute(DATABASE_ID, COLLECTION_ID, key);
        if (attr.status === 'available') {
          console.log(`✅ '${key}' is now available`);
          return true;
        }
      } catch (e) {
        // Attribute not ready yet
      }
      await sleep(1000);
      attempts++;
      process.stdout.write('.');
    }
    
    console.log(`\n⚠️  Timeout waiting for '${key}', but it should be available soon`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating '${key}':`, error.message);
    return false;
  }
}

async function fixSchema() {
  console.log(`\n📊 Configuration:`);
  console.log(`   Endpoint: ${ENDPOINT}`);
  console.log(`   Project: ${PROJECT_ID}`);
  console.log(`   Database: ${DATABASE_ID}`);
  console.log(`   Collection: ${COLLECTION_ID}`);
  
  console.log('\n🔍 Checking current schema...');
  
  try {
    const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
    console.log(`✅ Found collection: ${collection.name}`);
    
    // Check current attributes
    const attributes = collection.attributes || [];
    const imagesAttr = attributes.find(a => a.key === 'images');
    const sizesAttr = attributes.find(a => a.key === 'sizes');
    
    console.log('\n📋 Current Attributes:');
    if (imagesAttr) {
      console.log(`   images: ${imagesAttr.type} (array: ${imagesAttr.array || false})`);
    } else {
      console.log(`   images: NOT FOUND`);
    }
    
    if (sizesAttr) {
      console.log(`   sizes: ${sizesAttr.type} (array: ${sizesAttr.array || false})`);
    } else {
      console.log(`   sizes: NOT FOUND`);
    }
    
    // Fix images
    if (!imagesAttr || !imagesAttr.array) {
      console.log('\n🔧 Fixing images attribute...');
      if (imagesAttr) {
        await deleteAttribute('images');
        await sleep(2000); // Wait for deletion to complete
      }
      await createStringArrayAttribute('images', 2000, true);
    } else {
      console.log('\n✅ images attribute is already correct');
    }
    
    // Fix sizes
    if (!sizesAttr || !sizesAttr.array) {
      console.log('\n🔧 Fixing sizes attribute...');
      if (sizesAttr) {
        await deleteAttribute('sizes');
        await sleep(2000);
      }
      await createStringArrayAttribute('sizes', 20, true);
    } else {
      console.log('\n✅ sizes attribute is already correct');
    }
    
    console.log('\n\n🎉 Schema fix complete!');
    console.log('\n📋 Summary:');
    console.log('   ✅ images: string array (max 2000 chars per URL)');
    console.log('   ✅ sizes: string array (max 20 chars per size)');
    console.log('\n💡 You can now create products with multiple images and sizes!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 401) {
      console.log('\n💡 Tip: Make sure your API key has the correct permissions');
    }
    process.exit(1);
  }
}

// Run the fix
fixSchema().catch(console.error);
