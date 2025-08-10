// data/search.ts
import { supabase } from '../supabaseClient';

export type Recipe = {
  id: number | string;
  title: string;
  description?: string;
  image?: string;        // app expects `image`
  protein?: number;      // grams per serving
  calories?: number;     // kcal per serving
  rating?: number;
  staffPick?: boolean;
  // optional/future
  carbs?: number;        // grams per serving
  fat?: number;
  vegan?: boolean;
  glutenFree?: boolean;
};

type Filters = {
  highProtein?: boolean;
  lowCalorie?: boolean;
  lowCarb?: boolean;     // NOTE: was LowCarb
  vegan?: boolean;
  glutenFree?: boolean;
};

type SortKey = 'relevance' | 'rating_desc' | 'protein_desc' | 'staff_picks';

const LOCAL_SAMPLE: Recipe[] = [
  { id: 1, title: 'Grilled Chicken and Salad', image: 'https://images.unsplash.com/photo-1662192512691-2786c53eca40?q=80&w=388&auto=format&fit=crop', protein: 35, calories: 300, rating: 4.7, staffPick: true },
  { id: 2, title: 'Vegan Buddha Bowl', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', protein: 18, calories: 500, rating: 4.5, staffPick: false },
];

const supabaseUsable = !!supabase && typeof (supabase as any).from === 'function';

// --- Nutrition rules (single source of truth) ---
function isLowCarb(r: Recipe): boolean {
  return typeof r.carbs === 'number' && r.carbs < 50;          // < 50g carbs/serving
}
function isLowCalorie(r: Recipe): boolean {
  return typeof r.calories === 'number' && r.calories < 200;   // < 200 kcal/serving
}
function isHighProtein(r: Recipe): boolean {
  // protein_g * 10 > calories/serving
  return typeof r.protein === 'number' &&
         typeof r.calories === 'number' &&
         (r.protein * 10) > r.calories;
}

function matchesNutritionFilters(r: Recipe, f: Filters): boolean {
  if (f.lowCarb && !isLowCarb(r)) return false;
  if (f.lowCalorie && !isLowCalorie(r)) return false;
  if (f.highProtein && !isHighProtein(r)) return false;
  return true;
}

// helper: normalize a DB row to the shape the app uses
function mapRow(r: any): Recipe {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? r.desc ?? undefined,
    image: r.image_url ?? r.image ?? undefined,
    protein: r.protein ?? r.protein_g ?? undefined,
    calories: r.calories ?? r.calories_per_serving ?? undefined,
    rating: r.rating ?? undefined,
    staffPick: r.staffPick ?? r.staff_pick ?? false,
    carbs: r.carbs ?? r.carbs_per_serving ?? undefined,
    fat: r.fat ?? undefined,
    vegan: r.vegan ?? undefined,
    glutenFree: r.glutenFree ?? r.gluten_free ?? undefined,
  };
}

export async function searchRecipes({
  query = '',
  filters = {} as Filters,
  sort = 'relevance' as SortKey,
  limit = 30,
  offset = 0,
}: {
  query?: string;
  filters?: Filters;
  sort?: SortKey;
  limit?: number;
  offset?: number;
}): Promise<Recipe[]> {
  const qNorm = (query ?? '').trim();

  if (supabaseUsable) {
    try {
      // Base select. We may fetch a little extra because we filter client-side for the highProtein rule.
      // If you have many rows and strong filters, consider increasing this range or adding generated columns in DB.
      let q = supabase
        .from('recipes')
        .select('*')
        .range(offset, offset + Math.max(limit * 2 - 1, limit - 1)); // fetch extra to account for client-side filtering

      // text search across title + description
      if (qNorm) q = q.or(`title.ilike.%${qNorm}%,description.ilike.%${qNorm}%`);

      // Push what we can to the DB:
      // lowCalorie and lowCarb are simple column comparisons
      if (filters.lowCalorie) q = q.lt('calories', 200);   // < 200 kcal
      if (filters.lowCarb)    q = q.lt('carbs', 50);       // < 50 g carbs
      if (filters.vegan)      q = q.eq('vegan', true);
      if (filters.glutenFree) q = q.eq('gluten_free', true); // adjust if your column is camelCase

      // Server-side sort where possible
      switch (sort) {
        case 'rating_desc':
          q = q.order('rating', { ascending: false });
          break;
        case 'protein_desc':
          q = q.order('protein', { ascending: false });
          break;
        case 'staff_picks':
          // Sort staff picks first, then rating
          q = q.order('staff_pick', { ascending: false }).order('rating', { ascending: false });
          break;
        case 'relevance':
        default:
          break; // leave natural order from text search
      }

      const { data, error } = await q;
      if (error) throw error;

      // Normalize rows and apply the canonical predicate (handles highProtein rule)
      let rows = (data ?? []).map(mapRow);
      rows = rows.filter((r) => matchesNutritionFilters(r, filters));

      // Final client-side sort safeguard (in case column names differ)
      switch (sort) {
        case 'rating_desc':
          rows = rows.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
          break;
        case 'protein_desc':
          rows = rows.sort((a, b) => (b.protein ?? -1) - (a.protein ?? -1));
          break;
        case 'staff_picks':
          rows = rows.sort(
            (a, b) =>
              ((b.staffPick ? 1 : 0) - (a.staffPick ? 1 : 0)) ||
              (b.rating ?? -1) - (a.rating ?? -1)
          );
          break;
        case 'relevance':
        default:
          break;
      }

      // Respect limit after client-side filtering
      return rows.slice(0, limit);
    } catch (err) {
      console.log('Supabase search failed, falling back to local:', err);
    }
  }

  // ------- Local fallback -------
  const matchesQuery = (r: Recipe) =>
    !qNorm ||
    r.title?.toLowerCase().includes(qNorm.toLowerCase()) ||
    r.description?.toLowerCase().includes(qNorm.toLowerCase());

  const matchesFilters = (r: Recipe) => {
    if (!matchesNutritionFilters(r, filters)) return false;
    if (filters.vegan && !r.vegan) return false;
    if (filters.glutenFree && !r.glutenFree) return false;
    return true;
  };

  let rows = LOCAL_SAMPLE.filter((r) => matchesQuery(r) && matchesFilters(r));

  switch (sort) {
    case 'rating_desc':
      rows = rows.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
      break;
    case 'protein_desc':
      rows = rows.sort((a, b) => (b.protein ?? -1) - (a.protein ?? -1));
      break;
    case 'staff_picks':
      rows = rows.sort(
        (a, b) =>
          ((b.staffPick ? 1 : 0) - (a.staffPick ? 1 : 0)) ||
          (b.rating ?? -1) - (a.rating ?? -1)
      );
      break;
    case 'relevance':
    default:
      break;
  }

  return rows.slice(0, limit);
}
