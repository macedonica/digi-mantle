import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LibraryLanguage {
  id: string;
  name_mk: string;
  name_en: string;
  value: string;
  sort_order: number;
  is_active: boolean;
}

export interface LibraryCategory {
  id: string;
  name_mk: string;
  name_en: string;
  value: string;
  type: 'book' | 'image' | 'periodical';
  sort_order: number;
  is_active: boolean;
}

export const useLibraryLanguages = (includeInactive = false) => {
  return useQuery({
    queryKey: ['library-languages', includeInactive],
    queryFn: async () => {
      let query = supabase
        .from('library_languages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as LibraryLanguage[];
    },
  });
};

export const useLibraryCategories = (type: 'book' | 'image' | 'periodical', includeInactive = false) => {
  return useQuery({
    queryKey: ['library-categories', type, includeInactive],
    queryFn: async () => {
      let query = supabase
        .from('library_categories')
        .select('*')
        .eq('type', type)
        .order('sort_order', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as LibraryCategory[];
    },
  });
};

export interface LibraryNewspaper {
  id: string;
  name_mk: string;
  name_en: string;
  value: string;
  sort_order: number;
  is_active: boolean;
}

export const useLibraryNewspapers = (includeInactive = false) => {
  return useQuery({
    queryKey: ['library-newspapers', includeInactive],
    queryFn: async () => {
      let query = supabase
        .from('library_newspapers')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as LibraryNewspaper[];
    },
  });
};
