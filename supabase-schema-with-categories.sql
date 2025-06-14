-- Create the categories table first
CREATE TABLE IF NOT EXISTS public.categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the APIs table with foreign key to categories
CREATE TABLE IF NOT EXISTS public.apis (
    id BIGSERIAL PRIMARY KEY,
    api_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    auth VARCHAR(100) DEFAULT '',
    https BOOLEAN DEFAULT true,
    cors VARCHAR(50) DEFAULT '',
    link VARCHAR(500) NOT NULL,
    category_id BIGINT REFERENCES public.categories(id),
    category_name VARCHAR(100) NOT NULL, -- Keep for backward compatibility and faster queries
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

CREATE INDEX IF NOT EXISTS idx_apis_category_id ON public.apis(category_id);
CREATE INDEX IF NOT EXISTS idx_apis_category_name ON public.apis(category_name);
CREATE INDEX IF NOT EXISTS idx_apis_api_name ON public.apis(api_name);
CREATE INDEX IF NOT EXISTS idx_apis_search ON public.apis USING gin(to_tsvector('english', api_name || ' ' || description || ' ' || category_name));

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apis ENABLE ROW LEVEL SECURITY;

-- Create policies to allow read access to all users
CREATE POLICY "Allow public read access on categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on apis" ON public.apis
    FOR SELECT USING (true);

-- Create policies for authenticated users (optional, for future features)
CREATE POLICY "Allow authenticated insert on categories" ON public.categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on categories" ON public.categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on apis" ON public.apis
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on apis" ON public.apis
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create functions to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apis_updated_at BEFORE UPDATE ON public.apis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
