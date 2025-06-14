const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Please set REACT_APP_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateApisWithCategories() {
  try {
    console.log('Starting API migration with categories to Supabase...');
    
    // First, get all categories from Supabase to create a mapping
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name');
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      throw categoriesError;
    }
    
    const categoryMapping = {};
    categories.forEach(cat => {
      categoryMapping[cat.name] = cat.id;
    });
    
    console.log(`Found ${categories.length} categories in database`);
    
    // Read the APIs JSON file
    const jsonPath = path.join(__dirname, '../public-apis/db/resources.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log(`Found ${jsonData.count} APIs to migrate`);
    
    // Clear existing APIs table (since we're updating the structure)
    console.log('Clearing existing APIs...');
    const { error: deleteError } = await supabase
      .from('apis')
      .delete()
      .neq('id', 0); // Delete all rows
    
    if (deleteError) {
      console.error('Error clearing APIs table:', deleteError);
      throw deleteError;
    }
    
    // Transform data for Supabase with category relationships
    const apisToInsert = jsonData.entries.map(api => {
      const categoryId = categoryMapping[api.Category];
      if (!categoryId) {
        console.warn(`Warning: Category "${api.Category}" not found in categories table`);
      }
      
      return {
        api_name: api.API,
        description: api.Description,
        auth: api.Auth || '',
        https: api.HTTPS,
        cors: api.Cors,
        link: api.Link,
        category_id: categoryId || null,
        category_name: api.Category // Keep for backward compatibility
      };
    });
    
    // Insert data in batches to avoid timeout
    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < apisToInsert.length; i += batchSize) {
      const batch = apisToInsert.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('apis')
        .insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        throw error;
      }
      
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${apisToInsert.length} APIs`);
    }
    
    console.log('✅ API migration with categories completed successfully!');
    console.log(`Total APIs migrated: ${inserted}`);
    
    // Verify the data
    const { data: verifyData, error: verifyError } = await supabase
      .from('apis')
      .select('id, api_name, category_name, category_id')
      .limit(5);
    
    if (verifyError) {
      console.error('Error verifying data:', verifyError);
    } else {
      console.log('Sample migrated data:');
      console.table(verifyData);
    }
    
  } catch (error) {
    console.error('❌ API migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateApisWithCategories();
