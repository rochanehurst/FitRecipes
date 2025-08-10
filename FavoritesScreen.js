import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getFavorites,
  setFavorites as setFavoritesStore,   // ✅ rename to avoid clash
  clearFavorites
} from './favorites';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getFavorites();
      setFavorites(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const removeOne = async (id) => {
    const next = favorites.filter(r => String(r.id) !== String(id));
    setFavorites(next);
    await setFavoritesStore(next); // ✅ persist
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          {typeof item.protein === 'number' && <Text>Protein: {item.protein}g</Text>}
          {typeof item.calories === 'number' && <Text>Calories: {item.calories}</Text>}
        </View>
        <TouchableOpacity onPress={() => removeOne(item.id)} style={{ padding: 6 }}>
          <Text style={{ color: '#C62828', fontWeight: '600' }}>Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (!loading && favorites.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16 }}>
            Your Favorites
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>No favorites yet.</Text>
          <Text style={{ color: '#666' }}>Tap “Save to Favorites” on a recipe to store it here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Dark padded header, like Home */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 0 }}>
        <TouchableOpacity
          onPress={async () => { await clearFavorites(); await load(); }}
          style={{ alignSelf: 'flex-end', padding: 6 }}
        >
          <Text style={{ color: '#944EB1', fontWeight: '600' }}>Clear All</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>Your Favorites</Text>
      </View>

      {/* White content area */}
      <FlatList
        style={{ backgroundColor: '#fff', flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        data={favorites}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
});
