 // supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Use Expo public env vars (work at runtime in the client bundle)
const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// If keys are missing, export null so callers can fall back to local data.
export const supabase = (url && anon) ? createClient(url, anon) : null;
