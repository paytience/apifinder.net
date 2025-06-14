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
  static async getAllApis(): Promise<ApiEntry[]> {
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
        .order('api_name');

      if (error) {
        console.error('Error fetching APIs from Supabase:', error);
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

      query = query.order('api_name');

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
}
