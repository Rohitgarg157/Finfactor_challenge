import type { MealCategory, MealDetail, MealSummary } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message ?? 'Something went wrong';
    throw new Error(message);
  }

  return response.json();
};

export const fetchCategories = (): Promise<{ categories: MealCategory[] }> =>
  request('/meals/categories');

export const fetchMealsByCategory = (
  category: string,
): Promise<{ meals: MealSummary[] }> =>
  request(`/meals/categories/${encodeURIComponent(category)}`);

export const searchMeals = (query: string): Promise<{ meals: MealSummary[] }> =>
  request(`/meals/search?q=${encodeURIComponent(query)}`);

export const fetchMeal = (id: string): Promise<{ meal: MealDetail | null }> =>
  request(`/meals/${id}`);

export const fetchRandomMeal = (): Promise<{ meal: MealDetail }> =>
  request('/meals/random');

