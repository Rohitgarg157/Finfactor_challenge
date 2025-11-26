"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomMeal = exports.getMealById = exports.getMealsByCategory = exports.getCategories = exports.searchMeals = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const cache_1 = require("../utils/cache");
const mealApi = axios_1.default.create({
    baseURL: `${config_1.APP_CONFIG.mealDb.baseUrl}/${config_1.APP_CONFIG.mealDb.apiKey}`,
});
const cache = new cache_1.InMemoryCache(config_1.APP_CONFIG.cache.ttlMs, config_1.APP_CONFIG.cache.maxEntries);
const withCache = async (key, producer) => {
    const cached = cache.get(key);
    if (cached) {
        return cached;
    }
    const fresh = await producer();
    cache.set(key, fresh);
    return fresh;
};
const mapMealSummary = (meal) => ({
    idMeal: meal.idMeal ?? '',
    strMeal: meal.strMeal ?? '',
    strMealThumb: meal.strMealThumb ?? '',
});
const mapMealDetail = (meal) => {
    const ingredients = [];
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
const searchMeals = (query) => withCache(`search:${query}`, async () => {
    const { data } = await mealApi.get('/search.php', {
        params: { s: query },
    });
    return (data.meals ?? []).map(mapMealSummary);
});
exports.searchMeals = searchMeals;
const getCategories = () => withCache('categories', async () => {
    const { data } = await mealApi.get('/categories.php');
    return data.categories ?? [];
});
exports.getCategories = getCategories;
const getMealsByCategory = (category) => withCache(`category:${category}`, async () => {
    const { data } = await mealApi.get('/filter.php', {
        params: { c: category },
    });
    return (data.meals ?? []).map(mapMealSummary);
});
exports.getMealsByCategory = getMealsByCategory;
const getMealById = (id) => withCache(`meal:${id}`, async () => {
    const { data } = await mealApi.get('/lookup.php', {
        params: { i: id },
    });
    if (!data.meals || data.meals.length === 0) {
        return null;
    }
    const meal = data.meals[0];
    return meal ? mapMealDetail(meal) : null;
});
exports.getMealById = getMealById;
const getRandomMeal = () => withCache('meal:random', async () => {
    const { data } = await mealApi.get('/random.php');
    if (!data.meals || data.meals.length === 0) {
        throw new Error('No random meal found');
    }
    const meal = data.meals[0];
    if (!meal) {
        throw new Error('No random meal found');
    }
    return mapMealDetail(meal);
});
exports.getRandomMeal = getRandomMeal;
//# sourceMappingURL=mealService.js.map