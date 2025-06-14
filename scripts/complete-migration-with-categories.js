const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Please set REACT_APP_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function completeMigration() {
  try {
    console.log('🚀 Starting complete migration with categories...');
    
    // Step 1: Migrate categories
    console.log('\n📂 Step 1: Migrating categories...');
    const categoriesPath = path.join(__dirname, '../public-apis/db/categories.json');
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    
    console.log(`Found ${categoriesData.count} categories to migrate`);
    
    const categoriesToInsert = categoriesData.entries.map(category => ({
      name: category.name,
      slug: category.slug
    }));
    
    // Clear existing categories first
    await supabase.from('categories').delete().neq('id', 0);
    
    const { data: insertedCategories, error: categoriesError } = await supabase
      .from('categories')
      .insert(categoriesToInsert)
      .select();
    
    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError);
      throw categoriesError;
    }
    
    console.log(`✅ Categories migrated: ${insertedCategories.length}`);
    
    // Create category mapping
    const categoryMapping = {};
    insertedCategories.forEach(cat => {
      categoryMapping[cat.name] = cat.id;
    });
    
    // Step 2: Migrate APIs with category relationships
    console.log('\n🔗 Step 2: Migrating APIs with category relationships...');
    const apisPath = path.join(__dirname, '../public-apis/db/resources.json');
    const apisData = JSON.parse(fs.readFileSync(apisPath, 'utf8'));
    
    console.log(`Found ${apisData.count} APIs to migrate`);
    
    // Clear existing APIs
    await supabase.from('apis').delete().neq('id', 0);
    
    const apisToInsert = apisData.entries.map(api => {
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
        category_name: api.Category
      };
    });
    
    // Insert APIs in batches
    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < apisToInsert.length; i += batchSize) {
      const batch = apisToInsert.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('apis')
        .insert(batch);
      
      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        throw error;
      }
      
      inserted += batch.length;
      console.log(`  Inserted ${inserted}/${apisToInsert.length} APIs`);
    }
    
    console.log(`✅ APIs migrated: ${inserted}`);
    
    // Step 3: Verify the migration
    console.log('\n🔍 Step 3: Verifying migration...');
    
    const { data: categoryCount, error: catCountError } = await supabase
      .from('categories')
      .select('id', { count: 'exact' });
    
    const { data: apiCount, error: apiCountError } = await supabase
      .from('apis')
      .select('id', { count: 'exact' });
    
    if (catCountError || apiCountError) {
      console.error('Error verifying counts:', catCountError || apiCountError);
    } else {
      console.log(`📊 Verification complete:`);
      console.log(`  - Categories in database: ${categoryCount.length}`);
      console.log(`  - APIs in database: ${apiCount.length}`);
    }
    
    // Sample data verification
    const { data: sampleData, error: sampleError } = await supabase
      .from('apis')
      .select(`
        id,
        api_name,
        category_name,
        categories (
          id,
          name,
          slug
        )
      `)
      .limit(3);
    
    if (sampleError) {
      console.error('Error fetching sample data:', sampleError);
    } else {
      console.log('\n📋 Sample migrated data:');
      sampleData.forEach(api => {
        console.log(`  - ${api.api_name} (Category: ${api.category_name}, ID: ${api.categories?.id})`);
      });
    }
    
    console.log('\n🎉 Complete migration with categories finished successfully!');
    console.log(`\n📈 Summary:`);
    console.log(`  - Categories migrated: ${insertedCategories.length}`);
    console.log(`  - APIs migrated: ${inserted}`);
    console.log(`  - Database now has proper foreign key relationships`);
    console.log(`  - Ready for production use!`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the complete migration
completeMigration();
