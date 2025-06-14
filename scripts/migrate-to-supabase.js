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

async function migrateApis() {
  try {
    console.log('Starting API migration to Supabase...');
    
    // Read the JSON file
    const jsonPath = path.join(__dirname, '../public-apis/db/resources.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log(`Found ${jsonData.count} APIs to migrate`);
    
    // Transform data for Supabase
    const apisToInsert = jsonData.entries.map(api => ({
      api_name: api.API,
      description: api.Description,
      auth: api.Auth || '',
      https: api.HTTPS,
      cors: api.Cors,
      link: api.Link,
      category: api.Category
    }));
    
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
    
    console.log('✅ Migration completed successfully!');
    console.log(`Total APIs migrated: ${inserted}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateApis();
