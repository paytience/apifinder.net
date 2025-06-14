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
  category: string;
  created_at?: string;
  updated_at?: string;
}

export class ApiService {
  static async getAllApis(): Promise<ApiEntry[]> {
    try {
      const { data, error } = await supabase
        .from('apis')
        .select('*')
        .order('api_name');

      if (error) {
        console.error('Error fetching APIs from Supabase:', error);
        throw error;
      }

      // Transform Supabase data to match our ApiEntry interface
      return data.map((item: SupabaseApiEntry) => ({
        API: item.api_name,
        Description: item.description,
        Auth: item.auth,
        HTTPS: item.https,
        Cors: item.cors,
        Link: item.link,
        Category: item.category
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
        .select('*');

      // Add search filter
      if (searchTerm) {
        query = query.or(`api_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
      }

      // Add category filter
      if (category) {
        query = query.eq('category', category);
      }

      query = query.order('api_name');

      const { data, error } = await query;

      if (error) {
        console.error('Error searching APIs:', error);
        throw error;
      }

      // Transform Supabase data to match our ApiEntry interface
      return data.map((item: SupabaseApiEntry) => ({
        API: item.api_name,
        Description: item.description,
        Auth: item.auth,
        HTTPS: item.https,
        Cors: item.cors,
        Link: item.link,
        Category: item.category
      }));
    } catch (error) {
      console.error('Failed to search APIs:', error);
      throw error;
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('apis')
        .select('category')
        .order('category');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      // Get unique categories
      const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
      return uniqueCategories.sort();
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  static async addApi(api: Omit<SupabaseApiEntry, 'id' | 'created_at' | 'updated_at'>): Promise<ApiEntry> {
    try {
      const { data, error } = await supabase
        .from('apis')
        .insert([api])
        .select()
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
        Category: data.category
      };
    } catch (error) {
      console.error('Failed to add API:', error);
      throw error;
    }
  }
}
