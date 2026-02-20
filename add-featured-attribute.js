/**
 * Script to add the 'featured' boolean attribute to the Products collection
 * This needs to be run once to update the Appwrite schema
 */

require('dotenv').config({ path: '.env.local' });
const { Client, Databases } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || ''); // You need an API key with appropriate permissions

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID || '';
const PRODUCTS_COLLECTION_ID = process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID || '';

console.log('Configuration:');
console.log('- Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '(not set)');
console.log('- Project ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '(not set)');
console.log('- Database ID:', DATABASE_ID || '(not set)');
console.log('- Collection ID:', PRODUCTS_COLLECTION_ID || '(not set)');
console.log('- API Key:', process.env.APPWRITE_API_KEY ? '(set)' : '(not set)');
console.log('');

async function addFeaturedAttribute() {
  try {
    // Validate required environment variables
    if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
      throw new Error('NEXT_PUBLIC_APPWRITE_ENDPOINT is not set');
    }
    if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set');
    }
    if (!process.env.APPWRITE_API_KEY) {
      throw new Error('APPWRITE_API_KEY is not set. Please add it to your .env.local file');
    }
    if (!DATABASE_ID) {
      throw new Error('NEXT_PUBLIC_DATABASE_ID is not set');
    }
    if (!PRODUCTS_COLLECTION_ID) {
      throw new Error('NEXT_PUBLIC_PRODUCTS_COLLECTION_ID is not set');
    }

    console.log('Adding "featured" attribute to Products collection...');
    
    // Add the featured boolean attribute
    await databases.createBooleanAttribute(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      'featured',
      false, // required = false (optional field)
      false  // default = false (not featured by default)
    );
    
    console.log('✅ Successfully added "featured" attribute!');
    console.log('The attribute may take a few moments to be fully available.');
    console.log('You can now mark products as featured in the admin panel.');
    
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  "featured" attribute already exists in the collection.');
    } else {
      console.error('❌ Error adding featured attribute:', error.message);
      if (error.response) {
        console.error('Response:', error.response);
      }
    }
  }
}

// Run the script
addFeaturedAttribute();
