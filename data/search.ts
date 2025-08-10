// data/search.ts
import { supabase } from '../supabaseClient';

export type Recipe = {
  id: string | number;
  title: string;
  image?: string;
  protein?: number;
  calories?: number;
  carbs?: number;
  fat?: number;
  vegan?: boolean;
  glutenFree?: boolean;
  rating?: number;
};

const LOCAL_SAMPLE: Recipe[] = [
  { id: '1', title: 'Grilled Chicken and Salad', image: 'https://images.unsplash.com/photo-1662192512691-2786c53eca40?q=80&w=388&auto=format&fit=crop', protein: 35, calories: 400, carbs: 40, fat: 10, vegan: false, glutenFree: true, rating: 4.5 },
  { id: '2', title: 'Chickpea Curry', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', protein: 14, calories: 520, carbs: 65, fat: 14, vegan: true, glutenFree: true, rating: 4.7 },
];

type Filters = {
  highProtein?: boolean;
  lowCalorie?: boolean;
  LowCarb?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
};

const supabaseLooksUsable =
  !!supabase &&
  typeof (supabase as any).from === 'function' &&
  // if you export url/key in your client you can check those too
  true;

export async function searchRecipes(
  { query = '', filters = {} as Filters, limit = 30, offset = 0 }:
  { query?: string; filters?: Filters; limit?: number; offset?: number; }
): Promise<Recipe[]> {
  const qNorm = (query ?? '').trim();

  // ---- Try Supabase, but time out fast in dev
  if (supabaseLooksUsable) {
    try {
      const fetchPromise = (async () => {
        let q = supabase.from('recipes').select('*').range(offset, offset + limit - 1);
        if (qNorm) q = q.ilike('title', `%${qNorm}%`);

        if (filters.highProtein) q = q.gte('protein', 25);
        if (filters.lowCalorie) q = q.lte('calories', 500);
        if (filters.LowCarb)    q = q.lte('carbs', 30);
        if (filters.vegan)      q = q.eq('vegan', true);
        if (filters.glutenFree) q = q.eq('glutenFree', true);

        const { data, error } = await q;
        if (error) throw error;

        return (data || []).map((r: any) => ({
          ...r,
          // accept snake_case too
          glutenFree: r.glutenFree ?? r.gluten_free ?? r.glutenfree ?? false,
        })) as Recipe[];
      })();

      const withTimeout = Promise.race([
        fetchPromise,
        new Promise<Recipe[]>((resolve) => setTimeout(() => resolve(null as any), 3000)),
      ]);

      const data = await withTimeout;
      if (Array.isArray(data)) return data;
      // timed out -> fall through to local
    } catch (e) {
      // swallow and fall back
      console.log('Supabase search failed, using local:', e);
    }
  }

  // ---- Local fallback (works immediately)
  const matchesQuery = (r: Recipe) =>
    !qNorm || r.title.toLowerCase().includes(qNorm.toLowerCase());

  const matchesFilters = (r: Recipe) => {
    if (filters.highProtein && !(typeof r.protein === 'number' && r.protein >= 25)) return false;
    if (filters.lowCalorie && !(typeof r.calories === 'number' && r.calories <= 500)) return false;
    if (filters.LowCarb     && !(typeof r.carbs === 'number' && r.carbs <= 30)) return false;
    if (filters.vegan       && !(r.vegan === true)) return false;
    if (filters.glutenFree  && !(r.glutenFree === true)) return false;
    return true;
  };

  return LOCAL_SAMPLE.filter(r => matchesQuery(r) && matchesFilters(r)).slice(0, limit);
}
