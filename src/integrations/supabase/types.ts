export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      library_categories: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          name_en: string
          name_mk: string
          sort_order: number
          type: string
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          name_en: string
          name_mk: string
          sort_order?: number
          type: string
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          name_en?: string
          name_mk?: string
          sort_order?: number
          type?: string
          value?: string
        }
        Relationships: []
      }
      library_items: {
        Row: {
          additional_images: string[] | null
          author: string
          author_en: string | null
          category: string[]
          created_at: string | null
          description_en: string | null
          description_mk: string | null
          id: string
          image_url: string | null
          issue_number_en: string | null
          issue_number_mk: string | null
          keywords: string[] | null
          language: string[]
          pdf_url: string | null
          publication_city: string | null
          publication_city_en: string | null
          publisher: string | null
          publisher_en: string | null
          source_en: string | null
          source_mk: string | null
          thumbnail_url: string
          title_en: string
          title_mk: string
          type: string
          type_en: string | null
          type_mk: string | null
          updated_at: string | null
          uploaded_by: string | null
          year: string | null
          year_en: string | null
          year_mk: string | null
        }
        Insert: {
          additional_images?: string[] | null
          author: string
          author_en?: string | null
          category?: string[]
          created_at?: string | null
          description_en?: string | null
          description_mk?: string | null
          id?: string
          image_url?: string | null
          issue_number_en?: string | null
          issue_number_mk?: string | null
          keywords?: string[] | null
          language?: string[]
          pdf_url?: string | null
          publication_city?: string | null
          publication_city_en?: string | null
          publisher?: string | null
          publisher_en?: string | null
          source_en?: string | null
          source_mk?: string | null
          thumbnail_url: string
          title_en: string
          title_mk: string
          type: string
          type_en?: string | null
          type_mk?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          year?: string | null
          year_en?: string | null
          year_mk?: string | null
        }
        Update: {
          additional_images?: string[] | null
          author?: string
          author_en?: string | null
          category?: string[]
          created_at?: string | null
          description_en?: string | null
          description_mk?: string | null
          id?: string
          image_url?: string | null
          issue_number_en?: string | null
          issue_number_mk?: string | null
          keywords?: string[] | null
          language?: string[]
          pdf_url?: string | null
          publication_city?: string | null
          publication_city_en?: string | null
          publisher?: string | null
          publisher_en?: string | null
          source_en?: string | null
          source_mk?: string | null
          thumbnail_url?: string
          title_en?: string
          title_mk?: string
          type?: string
          type_en?: string | null
          type_mk?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          year?: string | null
          year_en?: string | null
          year_mk?: string | null
        }
        Relationships: []
      }
      library_languages: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          name_en: string
          name_mk: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          name_en: string
          name_mk: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          name_en?: string
          name_mk?: string
          sort_order?: number
          value?: string
        }
        Relationships: []
      }
      library_newspapers: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          name_en: string
          name_mk: string
          sort_order: number
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          name_en: string
          name_mk: string
          sort_order?: number
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          name_en?: string
          name_mk?: string
          sort_order?: number
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_library_items: {
        Row: {
          additional_images: string[] | null
          author: string | null
          author_en: string | null
          category: string[] | null
          created_at: string | null
          description_en: string | null
          description_mk: string | null
          id: string | null
          image_url: string | null
          keywords: string[] | null
          language: string[] | null
          pdf_url: string | null
          publication_city: string | null
          publication_city_en: string | null
          publisher: string | null
          publisher_en: string | null
          source_en: string | null
          source_mk: string | null
          thumbnail_url: string | null
          title_en: string | null
          title_mk: string | null
          type: string | null
          type_en: string | null
          type_mk: string | null
          updated_at: string | null
          year: string | null
          year_en: string | null
          year_mk: string | null
        }
        Insert: {
          additional_images?: string[] | null
          author?: string | null
          author_en?: string | null
          category?: string[] | null
          created_at?: string | null
          description_en?: string | null
          description_mk?: string | null
          id?: string | null
          image_url?: string | null
          keywords?: string[] | null
          language?: string[] | null
          pdf_url?: string | null
          publication_city?: string | null
          publication_city_en?: string | null
          publisher?: string | null
          publisher_en?: string | null
          source_en?: string | null
          source_mk?: string | null
          thumbnail_url?: string | null
          title_en?: string | null
          title_mk?: string | null
          type?: string | null
          type_en?: string | null
          type_mk?: string | null
          updated_at?: string | null
          year?: string | null
          year_en?: string | null
          year_mk?: string | null
        }
        Update: {
          additional_images?: string[] | null
          author?: string | null
          author_en?: string | null
          category?: string[] | null
          created_at?: string | null
          description_en?: string | null
          description_mk?: string | null
          id?: string | null
          image_url?: string | null
          keywords?: string[] | null
          language?: string[] | null
          pdf_url?: string | null
          publication_city?: string | null
          publication_city_en?: string | null
          publisher?: string | null
          publisher_en?: string | null
          source_en?: string | null
          source_mk?: string | null
          thumbnail_url?: string | null
          title_en?: string | null
          title_mk?: string | null
          type?: string | null
          type_en?: string | null
          type_mk?: string | null
          updated_at?: string | null
          year?: string | null
          year_en?: string | null
          year_mk?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
