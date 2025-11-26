"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mealService_1 = require("../services/mealService");
const router = (0, express_1.Router)();
router.get('/search', async (req, res, next) => {
    try {
        const query = String(req.query.q ?? '').trim();
        if (!query) {
            res.status(400).json({ message: 'Query parameter q is required' });
            return;
        }
        const meals = await (0, mealService_1.searchMeals)(query);
        res.json({ meals });
    }
    catch (error) {
        next(error);
    }
});
router.get('/categories', async (_req, res, next) => {
    try {
        const categories = await (0, mealService_1.getCategories)();
        res.json({ categories });
    }
    catch (error) {
        next(error);
    }
});
router.get('/categories/:category', async (req, res, next) => {
    try {
        const category = req.params.category;
        const meals = await (0, mealService_1.getMealsByCategory)(category);
        res.json({ meals });
    }
    catch (error) {
        next(error);
    }
});
router.get('/random', async (_req, res, next) => {
    try {
        const meal = await (0, mealService_1.getRandomMeal)();
        res.json({ meal });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const meal = await (0, mealService_1.getMealById)(req.params.id);
        if (!meal) {
            res.status(404).json({ message: 'Meal not found' });
            return;
        }
        res.json({ meal });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=meals.js.map