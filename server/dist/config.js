"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.APP_CONFIG = {
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
//# sourceMappingURL=config.js.map