import dotenv from 'dotenv';

dotenv.config();

export const APP_CONFIG = {
  port: Number(process.env.PORT) || 4000,
  mealDb: {
    baseUrl: process.env.MEALDB_BASE_URL ?? 'https://www.themealdb.com/api/json/v1',
    apiKey: process.env.MEALDB_API_KEY ?? '1',
  },
  cache: {
    ttlMs: Number(process.env.CACHE_TTL_MS) || 1000 * 60 * 5, // 5 minutes
    maxEntries: Number(process.env.CACHE_MAX_ENTRIES) || 100,
  },
};

