require('dotenv').config({ path: '.env.local' });
const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function testFeaturedProducts() {
  try {
    console.log('Checking for featured products...\n');
    
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID,
      [
        Query.equal('featured', true),
        Query.limit(10),
      ]
    );
    
    console.log(`Found ${response.documents.length} featured products:\n`);
    
    if (response.documents.length === 0) {
      console.log('❌ No products are marked as featured yet.');
      console.log('\nTo fix this:');
      console.log('1. Go to http://localhost:3000/admin');
      console.log('2. Navigate to Products');
      console.log('3. Edit a product and check the "⭐ Feature this product on the homepage" checkbox');
      console.log('4. Save the product');
      console.log('5. Refresh the homepage');
    } else {
      response.documents.forEach((doc, i) => {
        console.log(`${i + 1}. ${doc.title} (ID: ${doc.$id})`);
      });
      console.log('\n✅ These products should appear on the homepage!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

testFeaturedProducts();
