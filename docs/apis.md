# 🌐 External APIs – Nutrition & Recipes

## 🍽 Spoonacular API
- Used to search for recipes and get nutrition breakdowns
- Data stored in Supabase to cache results

## Sample Fields Used:
- Title
- Ingredients list
- Instructions
- Nutrition (protein, calories, carbs, fat)
- Image URL

## Notes:
- Recipes will be stored server-side for performance
- If API limit is reached, fallback to a smaller local seed
