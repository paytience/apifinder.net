-- Step 1: Create the categories table first
CREATE TABLE IF NOT EXISTS public.categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Add the category_id column to the existing apis table
ALTER TABLE public.apis 
ADD COLUMN IF NOT EXISTS category_id BIGINT REFERENCES public.categories(id);

-- Step 3: Add category_name column if it doesn't exist (for backward compatibility)
ALTER TABLE public.apis 
ADD COLUMN IF NOT EXISTS category_name VARCHAR(100);

-- Step 4: Update category_name column to use existing category data if it exists
-- (This handles the case where you already have category data in a different column)
UPDATE public.apis 
SET category_name = category 
WHERE category_name IS NULL AND category IS NOT NULL;

-- Step 5: Drop the old category column if it exists (after copying data)
ALTER TABLE public.apis 
DROP COLUMN IF EXISTS category;

-- Step 6: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_apis_category_id ON public.apis(category_id);
CREATE INDEX IF NOT EXISTS idx_apis_category_name ON public.apis(category_name);
CREATE INDEX IF NOT EXISTS idx_apis_api_name ON public.apis(api_name);

-- Step 7: Update the search index to include category_name
DROP INDEX IF EXISTS idx_apis_search;
CREATE INDEX idx_apis_search ON public.apis USING gin(to_tsvector('english', api_name || ' ' || description || ' ' || COALESCE(category_name, '')));

-- Step 8: Enable Row Level Security (RLS) if not already enabled
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apis ENABLE ROW LEVEL SECURITY;

-- Step 9: Create policies to allow read access to all users (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Allow public read access on categories') THEN
        CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'apis' AND policyname = 'Allow public read access on apis') THEN
        CREATE POLICY "Allow public read access on apis" ON public.apis FOR SELECT USING (true);
    END IF;
END $$;

-- Step 10: Create policies for authenticated users (optional, for future features)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Allow authenticated insert on categories') THEN
        CREATE POLICY "Allow authenticated insert on categories" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Allow authenticated update on categories') THEN
        CREATE POLICY "Allow authenticated update on categories" ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'apis' AND policyname = 'Allow authenticated insert on apis') THEN
        CREATE POLICY "Allow authenticated insert on apis" ON public.apis FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'apis' AND policyname = 'Allow authenticated update on apis') THEN
        CREATE POLICY "Allow authenticated update on apis" ON public.apis FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Step 11: Create function to update the updated_at timestamp (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 12: Create triggers to automatically update updated_at (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at') THEN
        CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_apis_updated_at') THEN
        CREATE TRIGGER update_apis_updated_at BEFORE UPDATE ON public.apis
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
