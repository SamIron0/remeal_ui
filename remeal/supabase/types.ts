export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
        };
        
      };
      recipes: {
        Row: {
          recipe_id: number;
          name: string;
          description: string | null;
          prep_time: number | null;
          cook_time: number | null;
          servings: number | null;
          instructions: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          recipe_id?: number;
          name: string;
          description?: string | null;
          prep_time?: number | null;
          cook_time?: number | null;
          servings?: number | null;
          instructions: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          recipe_id?: number;
          name?: string;
          description?: string | null;
          prep_time?: number | null;
          cook_time?: number | null;
          servings?: number | null;
          instructions?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      ingredients: {
        Row: {
          ingredient_id: number;
          name: string;
        };
        Insert: {
          ingredient_id?: number;
          name: string;
        };
        Update: {
          ingredient_id?: number;
          name?: string;
        };
      };
      categories: {
        Row: {
          category_id: number;
          name: string;
        };
        Insert: {
          category_id?: number;
          name: string;
        };
        Update: {
          category_id?: number;
          name?: string;
        };
      };
      ingredient_index: {
        Row: {
          id: number;
          ingredient: string;
          recipe_ids: number[];
        };
        Insert: {
          id?: number;
          ingredient: string;
          recipe_ids: number[];
        };
        Update: {
          id?: number;
          ingredient?: string;
          recipe_ids?: number[];
        };
      };
      nutrition_info: {
        Row: {
          recipe_id: number;
          calories: number | null;
          protein: number | null;
          carbohydrates: number | null;
          fat: number | null;
          fiber: number | null;
          sugar: number | null;
        };
        Insert: {
          recipe_id: number;
          calories?: number | null;
          protein?: number | null;
          carbohydrates?: number | null;
          fat?: number | null;
          fiber?: number | null;
          sugar?: number | null;
        };
        Update: {
          recipe_id?: number;
          calories?: number | null;
          protein?: number | null;
          carbohydrates?: number | null;
          fat?: number | null;
          fiber?: number | null;
          sugar?: number | null;
        };
      };
      recipe_categories: {
        Row: {
          recipe_id: number;
          category_id: number;
        };
        Insert: {
          recipe_id: number;
          category_id: number;
        };
        Update: {
          recipe_id?: number;
          category_id?: number;
        };
      };
      recipe_images: {
        Row: {
          image_id: number;
          recipe_id: number | null;
          file_path: string;
          file_name: string;
          file_size: number;
          mime_type: string;
          is_primary: boolean | null;
          created_at: string | null;
        };
        Insert: {
          image_id?: number;
          recipe_id?: number | null;
          file_path: string;
          file_name: string;
          file_size: number;
          mime_type: string;
          is_primary?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          image_id?: number;
          recipe_id?: number | null;
          file_path?: string;
          file_name?: string;
          file_size?: number;
          mime_type?: string;
          is_primary?: boolean | null;
          created_at?: string | null;
        };
      };
      recipe_ingredients: {
        Row: {
          recipe_id: number;
          ingredient_id: number;
          quantity: number | null;
          unit: string | null;
        };
        Insert: {
          recipe_id: number;
          ingredient_id: number;
          quantity?: number | null;
          unit?: string | null;
        };
        Update: {
          recipe_id?: number;
          ingredient_id?: number;
          quantity?: number | null;
          unit?: string | null;
        };
      };
      recipe_tags: {
        Row: {
          recipe_id: number;
          tag_id: number;
        };
        Insert: {
          recipe_id: number;
          tag_id: number;
        };
        Update: {
          recipe_id?: number;
          tag_id?: number;
        };
      };
      tags: {
        Row: {
          tag_id: number;
          name: string;
        };
        Insert: {
          tag_id?: number;
          name: string;
        };
        Update: {
          tag_id?: number;
          name?: string;
        };
      };
    };
  };
};
