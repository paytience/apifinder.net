-- Create the APIs table
CREATE TABLE IF NOT EXISTS public.apis (
    id BIGSERIAL PRIMARY KEY,
    api_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    auth VARCHAR(100) DEFAULT '',
    https BOOLEAN DEFAULT true,
    cors VARCHAR(50) DEFAULT '',
    link VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_apis_category ON public.apis(category);
CREATE INDEX IF NOT EXISTS idx_apis_api_name ON public.apis(api_name);
CREATE INDEX IF NOT EXISTS idx_apis_search ON public.apis USING gin(to_tsvector('english', api_name || ' ' || description || ' ' || category));

-- Enable Row Level Security (RLS)
ALTER TABLE public.apis ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users
CREATE POLICY "Allow public read access" ON public.apis
    FOR SELECT USING (true);

-- Create policy to allow insert for authenticated users (optional, for future features)
CREATE POLICY "Allow authenticated insert" ON public.apis
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow update for authenticated users (optional, for future features)
CREATE POLICY "Allow authenticated update" ON public.apis
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_apis_updated_at BEFORE UPDATE ON public.apis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
