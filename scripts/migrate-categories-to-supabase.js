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

async function migrateCategories() {
  try {
    console.log('Starting categories migration to Supabase...');
    
    // Read the categories JSON file
    const categoriesPath = path.join(__dirname, '../public-apis/db/categories.json');
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    
    console.log(`Found ${categoriesData.count} categories to migrate`);
    
    // Transform data for Supabase
    const categoriesToInsert = categoriesData.entries.map(category => ({
      name: category.name,
      slug: category.slug
    }));
    
    // Insert categories data
    const { data: insertedCategories, error: insertError } = await supabase
      .from('categories')
      .insert(categoriesToInsert)
      .select();
    
    if (insertError) {
      console.error('Error inserting categories:', insertError);
      throw insertError;
    }
    
    console.log('✅ Categories migration completed successfully!');
    console.log(`Total categories migrated: ${insertedCategories.length}`);
    
    // Create a mapping of category names to IDs for future use
    const categoryMapping = {};
    insertedCategories.forEach(cat => {
      categoryMapping[cat.name] = cat.id;
    });
    
    // Save the mapping to a file for the API migration script
    const mappingPath = path.join(__dirname, 'category-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(categoryMapping, null, 2));
    console.log(`Category mapping saved to: ${mappingPath}`);
    
    return categoryMapping;
    
  } catch (error) {
    console.error('❌ Categories migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateCategories();
