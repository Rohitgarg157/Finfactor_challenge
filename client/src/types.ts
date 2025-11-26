export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type Ingredient = {
  ingredient: string;
  measure: string;
};

export type MealDetail = MealSummary & {
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strYoutube: string | null;
  ingredients: Ingredient[];
};

export type MealCategory = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

