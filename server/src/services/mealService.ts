import axios from 'axios';
import { APP_CONFIG } from '../config';
import { InMemoryCache } from '../utils/cache';
import { MealCategory, MealDetail, MealSummary } from '../types/meal';

type ApiMeal = Record<string, string | null>;

type SearchResponse = { meals: ApiMeal[] | null };
type CategoriesResponse = { categories: MealCategory[] };

const mealApi = axios.create({
  baseURL: `${APP_CONFIG.mealDb.baseUrl}/${APP_CONFIG.mealDb.apiKey}`,
});

const cache = new InMemoryCache<unknown>(APP_CONFIG.cache.ttlMs, APP_CONFIG.cache.maxEntries);

const withCache = async <T>(key: string, producer: () => Promise<T>): Promise<T> => {
  const cached = cache.get(key) as T | undefined;
  if (cached) {
    return cached;
  }

  const fresh = await producer();
  cache.set(key, fresh);
  return fresh;
};

const mapMealSummary = (meal: ApiMeal): MealSummary => ({
  idMeal: meal.idMeal ?? '',
  strMeal: meal.strMeal ?? '',
  strMealThumb: meal.strMealThumb ?? '',
});

const mapMealDetail = (meal: ApiMeal): MealDetail => {
  const ingredients: MealDetail['ingredients'] = [];

  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`] ?? '';
    const measure = meal[`strMeasure${i}`] ?? '';
    if (ingredient.trim()) {
      ingredients.push({ ingredient: ingredient.trim(), measure: measure.trim() });
    }
  }

  return {
    ...mapMealSummary(meal),
    strCategory: meal.strCategory ?? '',
    strArea: meal.strArea ?? '',
    strInstructions: meal.strInstructions ?? '',
    strYoutube: meal.strYoutube ?? null,
    ingredients,
  };
};

export const searchMeals = (query: string): Promise<MealSummary[]> =>
  withCache(`search:${query}`, async () => {
    const { data } = await mealApi.get<SearchResponse>('/search.php', {
      params: { s: query },
    });

    return (data.meals ?? []).map(mapMealSummary);
  });

export const getCategories = (): Promise<MealCategory[]> =>
  withCache('categories', async () => {
    const { data } = await mealApi.get<CategoriesResponse>('/categories.php');
    return data.categories ?? [];
  });

export const getMealsByCategory = (category: string): Promise<MealSummary[]> =>
  withCache(`category:${category}`, async () => {
    const { data } = await mealApi.get<SearchResponse>('/filter.php', {
      params: { c: category },
    });

    return (data.meals ?? []).map(mapMealSummary);
  });

export const getMealById = (id: string): Promise<MealDetail | null> =>
  withCache(`meal:${id}`, async () => {
    const { data } = await mealApi.get<SearchResponse>('/lookup.php', {
      params: { i: id },
    });

    if (!data.meals || data.meals.length === 0) {
      return null;
    }
    const meal = data.meals[0];
    return meal ? mapMealDetail(meal) : null;
  });

export const getRandomMeal = (): Promise<MealDetail> =>
  withCache('meal:random', async () => {
    const { data } = await mealApi.get<SearchResponse>('/random.php');
    if (!data.meals || data.meals.length === 0) {
      throw new Error('No random meal found');
    }
    const meal = data.meals[0];
    if (!meal) {
      throw new Error('No random meal found');
    }
    return mapMealDetail(meal);
  });

