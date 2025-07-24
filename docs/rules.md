# 📱 Fitness Recipe App – Cursor AI Rules

## 🚀 App Overview
This is a **cross-platform mobile app** (iOS + Android) for fitness-focused users to explore recipes with specific macro goals. Users can log in, search for recipes, apply macro-based filters (like protein or calories), and save favorites.

Web version is not a current priority.

---

## ✅ Core Features

### 1. User Authentication
- Required for saving favorites
- Allow login via:
  - Email + password (minimum MVP)
  - (Optional later: Apple/Google sign-in)
- Use **Supabase Auth**

### 2. Recipe Filtering
- Sliders for:
  - Protein per serving (e.g., 0–100g)
  - Calories per serving (e.g., 0–800)
- Filter logic must work across all stored recipes

### 3. Recipe Search
- Search by keyword or ingredient (e.g., "chicken")

### 4. Recipe Details
- Show:
  - Title, ingredients, instructions
  - Macros per serving (protein, calories, carbs, fats)
  - Optional image

### 5. Favorite Recipes
- Logged-in users can:
  - Tap to favorite/unfavorite recipes
  - View saved recipes under "Favorites"
- Store in Supabase under user’s UID

---

## 💰 Monetization (Planned Post-MVP)
- In-app purchases or subscriptions for:
  - Premium filters
  - Exclusive recipe packs
  - Meal plan features
- Affiliate links (e.g., kitchen gear or ingredients)
- Use RevenueCat for cross-platform IAP management

---

## 📦 Tech Stack

### Frontend
- React Native + Expo
- Tailwind-style UI via NativeWind
- Expo Router or React Navigation

### Backend
- Supabase (PostgreSQL + Auth + Storage)
  - User accounts
  - Recipes table
  - Favorites linked to user UID

### Nutrition APIs
- Spoonacular API (recipe + macro data)
- Optional: Edamam or USDA FoodData Central

---

## 🛠 Tools & Workflow

- Cursor AI for generating code and components
- ChatGPT for logic and backend design
- GitHub for source control
- Expo Go for testing
- EAS for building iOS and Android binaries

---

## 🧪 Deployment

- Test on:
  - Real iOS devices (Expo Go or TestFlight)
  - Android devices (Expo Go or APK)
- Build with EAS Build for TestFlight & Google Play Console

---

## 🧾 UI/UX Requirements

- Clean, modern fitness-style design
- Macro info is visually emphasized
- Responsive sliders
- Persistent auth and user session
- Favorites accessible in a tab or user menu

---

## 🔒 Privacy & Security

- Use Supabase Auth for secure user login
- Must include placeholder Privacy Policy screen
- Favorites and user data stored securely

---

## 📈 Future Features (Not in MVP)
- Grocery list generator
- Custom meal planner
- AI recipe generator based on pantry
- Health app integrations (Apple Health / Google Fit)
