# Supabase Setup Guide for API Finder

This guide will help you set up Supabase for your API Finder application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - **Name**: `apifinder-net`
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"

## Step 2: Set Up the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL commands

This will create:
- An `apis` table with all necessary columns
- Indexes for better performance
- Row Level Security policies
- Automatic timestamp updates

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Go to your Supabase project dashboard
3. Navigate to **Settings** → **API** in the left sidebar
4. Copy the following values to your `.env` file:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public key** → `REACT_APP_SUPABASE_ANON_KEY`
   - **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY` (for data migration)

Your `.env` file should look like:
```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 4: Install Dependencies

```bash
npm install @supabase/supabase-js dotenv
```

## Step 5: Migrate Data from JSON to Supabase

Run the migration script to transfer all APIs from the local JSON file to Supabase:

```bash
node scripts/migrate-to-supabase.js
```

This script will:
- Read all APIs from `public-apis/db/resources.json`
- Transform the data to match the Supabase schema
- Insert the data in batches to avoid timeouts
- Provide progress updates during the migration

## Step 6: Start the Application

```bash
npm start
```

The application will now load data from Supabase instead of the local JSON file.

## Features Enabled by Supabase Integration

- **Real-time updates**: APIs can be updated in real-time
- **Better performance**: Database indexes provide faster search
- **Scalability**: Can handle much larger datasets
- **Advanced search**: Full-text search capabilities
- **API management**: Future ability to add/edit APIs through the UI

## Troubleshooting

### "Missing Supabase environment variables" Error
- Make sure your `.env` file exists and contains the correct values
- Restart your development server after adding environment variables

### "Failed to load APIs" Error
- Check that your Supabase project is running
- Verify your API keys are correct
- Ensure the `apis` table exists and has data

### Migration Script Fails
- Make sure you're using the service role key (not the anon key) for migration
- Check that your database schema has been created
- Verify your internet connection

## Next Steps

With Supabase integrated, you can now:
1. Add real-time subscriptions for live updates
2. Implement user authentication
3. Add API management features (add/edit/delete APIs)
4. Implement advanced filtering and sorting
5. Add analytics and usage tracking

## Security Notes

- The anon key is safe to use in your frontend code
- Never expose the service role key in your frontend
- Row Level Security is enabled to protect your data
- Only authenticated users can modify data (if you implement auth)
