export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}
export interface UserProfile {
  email: string;
  full_name: string;
  avatar_url: string;
  is_premium: boolean;
  subscription_status: string;
  subscription_end_date: string;
  trial_end_date: string;
  trial_start_date: string;
}
export interface Recipe {
  id: number;
  name?: string;
  description?: string | null;
  recipe_ingredients?: {
    quantity?: number;
    unit?: string;
    ingredients?: {
      name?: string;
    };
  }[];
  nutrition_info?: {
    calories?: number;
    protein?: number;
    fat?: number;
    carbohydrates?: number;
  };
  image_url?: string;
}
