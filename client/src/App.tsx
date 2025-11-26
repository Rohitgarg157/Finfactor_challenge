import { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  fetchCategories,
  fetchMeal,
  fetchMealsByCategory,
  fetchRandomMeal,
  searchMeals,
} from './api';
import type { MealCategory, MealDetail, MealSummary } from './types';

type ViewState =
  | { type: 'empty' }
  | { type: 'loading'; message?: string }
  | { type: 'error'; message: string }
  | { type: 'list'; meals: MealSummary[]; title: string }
  | { type: 'detail'; meal: MealDetail };

const App = () => {
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<ViewState>({ type: 'empty' });

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.categories))
      .catch(() =>
        setView({ type: 'error', message: 'Failed to load categories. Please retry.' }),
      );
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setView({ type: 'loading', message: 'Searching meals...' });
    try {
      const { meals } = await searchMeals(searchTerm.trim());
      setSelectedCategory('');
      if (meals.length === 1) {
        const meal = await fetchMeal(meals[0].idMeal).then((res) => res.meal);
        setView(meal ? { type: 'detail', meal } : { type: 'list', meals, title: 'Search' });
      } else {
        setView({
          type: 'list',
          meals,
          title: meals.length ? `Results for "${searchTerm}"` : 'No matches',
        });
      }
    } catch (error) {
      setView({ type: 'error', message: (error as Error).message });
    }
  };

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setView({ type: 'loading', message: `Loading ${category} meals...` });
    try {
      const { meals } = await fetchMealsByCategory(category);
      setView({ type: 'list', meals, title: category });
    } catch (error) {
      setView({ type: 'error', message: (error as Error).message });
    }
  };

  const handleRandomMeal = async () => {
    setView({ type: 'loading', message: 'Finding something tasty...' });
    try {
      const { meal } = await fetchRandomMeal();
      setView({ type: 'detail', meal });
    } catch (error) {
      setView({ type: 'error', message: (error as Error).message });
    }
  };

  const handleMealClick = async (id: string) => {
    setView({ type: 'loading', message: 'Loading recipe...' });
    try {
      const { meal } = await fetchMeal(id);
      if (!meal) {
        setView({ type: 'error', message: 'Meal not found' });
        return;
      }
      setView({ type: 'detail', meal });
    } catch (error) {
      setView({ type: 'error', message: (error as Error).message });
    }
  };

  const categoryCards = useMemo(
    () =>
      categories.map((category) => (
        <button
          key={category.idCategory}
          className={`category-card ${selectedCategory === category.strCategory ? 'selected' : ''}`}
          onClick={() => handleCategorySelect(category.strCategory)}
        >
          <img src={category.strCategoryThumb} alt={category.strCategory} />
          <span>{category.strCategory}</span>
        </button>
      )),
    [categories, selectedCategory],
  );

  const renderView = () => {
    switch (view.type) {
      case 'loading':
        return <div className="status-card">⏳ {view.message ?? 'Loading...'}</div>;
      case 'error':
        return (
          <div className="status-card error">
            ⚠️ {view.message}
            <button onClick={() => setView({ type: 'empty' })}>Dismiss</button>
          </div>
        );
      case 'list':
        return (
          <section>
            <h2>{view.title}</h2>
            <div className="meals-grid">
              {view.meals.map((meal) => (
                <article key={meal.idMeal} className="meal-card">
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                  <h3>{meal.strMeal}</h3>
                  <button onClick={() => handleMealClick(meal.idMeal)}>View recipe</button>
                </article>
              ))}
            </div>
          </section>
        );
      case 'detail':
        return <MealDetailView meal={view.meal} onClose={() => setView({ type: 'empty' })} />;
      default:
        return (
          <div className="status-card">
            🔍 Try a search, pick a category, or let us surprise you!
          </div>
        );
    }
  };

  return (
    <div className="app">
      <header>
        <div>
          <h1>TheMealDB Explorer</h1>
          <p>Discover recipes, browse categories, and get inspired.</p>
        </div>
        <button className="random-btn" onClick={handleRandomMeal}>
          I'm feeling hungry 🍽️
        </button>
      </header>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search meals e.g. Arrabiata"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <section>
        <h2>Categories</h2>
        <div className="categories-grid">{categoryCards}</div>
      </section>

      {renderView()}
    </div>
  );
};

const MealDetailView = ({
  meal,
  onClose,
}: {
  meal: MealDetail;
  onClose: () => void;
}) => (
  <section className="meal-detail">
    <button className="back-btn" onClick={onClose}>
      ← Back
    </button>
    <div className="meal-detail-content">
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <div>
        <h2>{meal.strMeal}</h2>
        <p>
          <strong>Category:</strong> {meal.strCategory} · <strong>Area:</strong> {meal.strArea}
        </p>
        <h3>Ingredients</h3>
        <ul>
          {meal.ingredients.map((item) => (
            <li key={item.ingredient}>
              {item.ingredient}
              {item.measure && ` — ${item.measure}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <h3>Instructions</h3>
    <p className="instructions">{meal.strInstructions}</p>
    {meal.strYoutube && (
      <div className="video-wrapper">
        <iframe
          title="Recipe video"
          src={`https://www.youtube.com/embed/${new URL(meal.strYoutube).searchParams.get('v')}`}
          allowFullScreen
        />
      </div>
    )}
  </section>
);

export default App;
