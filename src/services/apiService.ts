import { supabase } from '../lib/supabase';
import { ApiEntry } from '../types';

export interface SupabaseApiEntry {
  id?: number;
  api_name: string;
  description: string;
  auth: string;
  https: boolean;
  cors: string;
  link: string;
  category_id?: number;
  category_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseCategoryEntry {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export class ApiService {
  static async getTotalApiCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('apis')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching total API count:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Failed to fetch total API count:', error);
      throw error;
    }
  }

  static async getAllApis(): Promise<ApiEntry[]> {
    try {
      let allApis: any[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('apis')
          .select(`
            *,
            categories (
              id,
              name,
              slug
            )
          `)
          .order('api_name')
          .range(from, from + batchSize - 1);

        if (error) {
          console.error('Error fetching APIs from Supabase:', error);
          throw error;
        }

        if (data && data.length > 0) {
          allApis = [...allApis, ...data];
          from += batchSize;
          hasMore = data.length === batchSize; // Continue if we got a full batch
        } else {
          hasMore = false;
        }
      }

      console.log(`Fetched ${allApis.length} APIs from Supabase using pagination`);

      // Transform Supabase data to match our ApiEntry interface
      return allApis.map((item: any) => ({
        API: item.api_name,
        Description: item.description,
        Auth: item.auth,
        HTTPS: item.https,
        Cors: item.cors,
        Link: item.link,
        Category: item.category_name || (item.categories ? item.categories.name : 'Unknown')
      }));
    } catch (error) {
      console.error('Failed to fetch APIs:', error);
      throw error;
    }
  }

  static async searchApis(searchTerm: string, category?: string): Promise<ApiEntry[]> {
    try {
      let query = supabase
        .from('apis')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `);

      // Add search filter
      if (searchTerm) {
        query = query.or(`api_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category_name.ilike.%${searchTerm}%`);
      }

      // Add category filter
      if (category) {
        query = query.eq('category_name', category);
      }

      query = query.order('api_name').limit(2000); // Increase limit

      const { data, error } = await query;

      if (error) {
        console.error('Error searching APIs:', error);
        throw error;
      }

      // Transform Supabase data to match our ApiEntry interface
      return data.map((item: any) => ({
        API: item.api_name,
        Description: item.description,
        Auth: item.auth,
        HTTPS: item.https,
        Cors: item.cors,
        Link: item.link,
        Category: item.category_name || (item.categories ? item.categories.name : 'Unknown')
      }));
    } catch (error) {
      console.error('Failed to search APIs:', error);
      throw error;
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      return data.map(category => category.name);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  static async getCategoriesWithDetails(): Promise<SupabaseCategoryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories with details:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch categories with details:', error);
      throw error;
    }
  }

  static async addApi(api: Omit<SupabaseApiEntry, 'id' | 'created_at' | 'updated_at'>): Promise<ApiEntry> {
    try {
      const { data, error } = await supabase
        .from('apis')
        .insert([api])
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .single();

      if (error) {
        console.error('Error adding API:', error);
        throw error;
      }

      return {
        API: data.api_name,
        Description: data.description,
        Auth: data.auth,
        HTTPS: data.https,
        Cors: data.cors,
        Link: data.link,
        Category: data.category_name || (data.categories ? data.categories.name : 'Unknown')
      };
    } catch (error) {
      console.error('Failed to add API:', error);
      throw error;
    }
  }

  static async addCategory(category: Omit<SupabaseCategoryEntry, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseCategoryEntry> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) {
        console.error('Error adding category:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  }

  static async getApiBySlug(slug: string): Promise<ApiEntry | null> {
    try {
      console.log('Looking for API with slug:', slug);
      
      // For "compress-video-api-job" we need to find "Compress Video API (Job)"
      // Let's try a more flexible approach
      
      // First try exact match by searching for APIs that contain the key words
      const searchTerms = slug.split('-').filter(term => term.length > 2); // Filter out short words
      console.log('Search terms from slug:', searchTerms);
      
      // Use pagination to get ALL APIs, just like in getAllApis()
      let allApis: any[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('apis')
          .select(`
            *,
            categories (
              id,
              name,
              slug
            )
          `)
          .order('api_name')
          .range(from, from + batchSize - 1);

        if (error) {
          console.error('Error fetching APIs:', error);
          return null;
        }

        if (data && data.length > 0) {
          allApis = [...allApis, ...data];
          from += batchSize;
          hasMore = data.length === batchSize; // Continue if we got a full batch
        } else {
          hasMore = false;
        }
      }

      console.log(`Found ${allApis.length} total APIs in database (with pagination)`);

      // Find API by checking if all search terms are present in the API name (case-insensitive)
      const matchedApi = allApis.find(api => {
        const apiNameLower = api.api_name.toLowerCase();
        return searchTerms.every(term => apiNameLower.includes(term.toLowerCase()));
      });

      // Debug: Show APIs that contain "compress" to see what's actually in the database
      const compressApis = allApis.filter(api => 
        api.api_name.toLowerCase().includes('compress')
      );
      console.log('APIs containing "compress" in database:', compressApis.map(api => api.api_name));

      if (!matchedApi) {
        console.log('No API found matching search terms:', searchTerms);
        return null;
      }

      console.log('Found matching API:', matchedApi.api_name);

      // Transform Supabase data to match our ApiEntry interface
      return {
        API: matchedApi.api_name,
        Description: matchedApi.description,
        Auth: matchedApi.auth,
        HTTPS: matchedApi.https,
        Cors: matchedApi.cors,
        Link: matchedApi.link,
        Category: matchedApi.category_name || (matchedApi.categories ? matchedApi.categories.name : 'Unknown')
      };
    } catch (error) {
      console.error('Failed to fetch API by slug:', error);
      return null;
    }
  }

  static async getApiById(id: number): Promise<ApiEntry | null> {
    try {
      const { data, error } = await supabase
        .from('apis')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching API by ID:', error);
        return null;
      }

      if (!data) return null;

      // Transform Supabase data to match our ApiEntry interface
      return {
        API: data.api_name,
        Description: data.description,
        Auth: data.auth,
        HTTPS: data.https,
        Cors: data.cors,
        Link: data.link,
        Category: data.category_name || (data.categories ? data.categories.name : 'Unknown')
      };
    } catch (error) {
      console.error('Failed to fetch API by ID:', error);
      return null;
    }
  }
}
