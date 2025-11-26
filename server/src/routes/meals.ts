import { Router } from 'express';
import {
  getCategories,
  getMealById,
  getMealsByCategory,
  getRandomMeal,
  searchMeals,
} from '../services/mealService';

const router = Router();

router.get('/search', async (req, res, next) => {
  try {
    const query = String(req.query.q ?? '').trim();
    if (!query) {
      res.status(400).json({ message: 'Query parameter q is required' });
      return;
    }

    const meals = await searchMeals(query);
    res.json({ meals });
  } catch (error) {
    next(error);
  }
});

router.get('/categories', async (_req, res, next) => {
  try {
    const categories = await getCategories();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

router.get('/categories/:category', async (req, res, next) => {
  try {
    const category = req.params.category;
    const meals = await getMealsByCategory(category);
    res.json({ meals });
  } catch (error) {
    next(error);
  }
});

router.get('/random', async (_req, res, next) => {
  try {
    const meal = await getRandomMeal();
    res.json({ meal });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const meal = await getMealById(req.params.id);
    if (!meal) {
      res.status(404).json({ message: 'Meal not found' });
      return;
    }

    res.json({ meal });
  } catch (error) {
    next(error);
  }
});

export default router;

