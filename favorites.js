import AsyncStorage from "@react-native-async-storage/async-storage";


const KEY = 'favorites:v1';

export async function getFavorites() {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
}

export async function setFavorites(list) {
    await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

/** Toggle: add if not present; remove if present. Returns updated list. */

export async function toggleFavorite(recipe) {
    const list = await getFavorites();
    const exists = list.some(r => String(r.id) === String(recipe.id));
    const next = exists
        ? list.filter(r => String(r.id) !== String(recipe.id))
        : [recipe, ...list];
    await setFavorites(next);
    return next;
}

export async function isFavorite(id) {
    const list = await getFavorites();
    return list.some(r => String(r.id) ===String(id));
    
}