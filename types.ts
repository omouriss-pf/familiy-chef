export enum DayOfWeek {
  Lundi = "Lundi",
  Mardi = "Mardi",
  Mercredi = "Mercredi",
  Jeudi = "Jeudi",
  Vendredi = "Vendredi",
  Samedi = "Samedi",
  Dimanche = "Dimanche"
}

export interface Meal {
  name: string;
  description: string;
  prepTimeMinutes: number;
  ingredients: string[];
  imageUrl?: string; // For the generated image
}

export interface DayPlan {
  day: DayOfWeek;
  lunch: Meal;
  dinner: Meal;
}

export interface ShoppingList {
  fruitsAndVeg: string[];
  dairyAndEggs: string[];
  meatAndFish: string[];
  pantryAndGrains: string[];
  frozen: string[];
  other: string[];
}

export interface WeeklyPlan {
  week: DayPlan[];
  shoppingList: ShoppingList;
  pantryStaples: string[];
}

export interface UserPreferences {
  familyMembers: number;
  dietaryRestrictions: string;
  likes: string;
  dislikes: string;
}