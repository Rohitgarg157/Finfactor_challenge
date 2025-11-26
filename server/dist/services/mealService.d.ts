import { MealCategory, MealDetail, MealSummary } from '../types/meal';
export declare const searchMeals: (query: string) => Promise<MealSummary[]>;
export declare const getCategories: () => Promise<MealCategory[]>;
export declare const getMealsByCategory: (category: string) => Promise<MealSummary[]>;
export declare const getMealById: (id: string) => Promise<MealDetail | null>;
export declare const getRandomMeal: () => Promise<MealDetail>;
//# sourceMappingURL=mealService.d.ts.map