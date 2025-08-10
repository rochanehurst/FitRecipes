import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, Image, TouchableOpacity,
  StyleSheet, ImageBackground, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons, SimpleLineIcons, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Carattere_400Regular } from '@expo-google-fonts/carattere';
import { getFavorites } from './favorites';

/* ---------- Mock data (top-level, outside component) ---------- */
const FEATURED_RECIPES = [
  { id: '1', title: 'Grilled Chicken and Salad', image: 'https://images.unsplash.com/photo-1662192512691-2786c53eca40?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: '2', title: 'Chickpea Curry', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { id: '3', title: 'English Breakfast', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' },
  { id: '4', title: 'Tomato Soup', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { id: '5', title: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80' },
  { id: '6', title: 'Fruit Parfait', image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80' },
].slice(0, 10);

const HIGHEST_RATED_RECIPES = [
  { id: '101', title: 'Avocado Toast', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { id: '102', title: 'Berry Smoothie', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80' },
  { id: '103', title: 'Quinoa Salad', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { id: '104', title: 'Egg Muffins', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' },
  { id: '105', title: 'Greek Yogurt Bowl', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80' },
  { id: '106', title: 'Veggie Stir Fry', image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80' },
].slice(0, 10);
/* ------------------------------------------------------------- */

export default function HomeScreen({ navigation }) {
  // local state
  const [query, setQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [favIds, setFavIds] = useState(new Set());
  const [fontsLoaded] = useFonts({ Carattere_400Regular });

  // route to catch reset flag from Results "Clear"
  const route = useRoute();

  // handle reset flag
  useFocusEffect(
    useCallback(() => {
      if (route.params?.reset) {
        setQuery('');
        setSelectedFilters([]);
        navigation.setParams?.({ reset: undefined }); // clear flag
      }
    }, [route.params?.reset, navigation])
  );

  // load saved favorites to show a bookmark on cards
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const list = await getFavorites();
        setFavIds(new Set(list.map(r => String(r.id))));
      })();
    }, [])
  );

  if (!fontsLoaded) return null;

  const FILTERS = [
    { key: 'highProtein', label: 'High Protein', icon: <Ionicons name="barbell" size={28} color="#944EB1" /> },
    { key: 'LowCarb',     label: 'Low Carb',     icon: <SimpleLineIcons name="energy" size={28} color="#944EB1" /> },
    { key: 'lowCalorie',  label: 'Low Calorie',  icon: <FontAwesome6 name="bowl-rice" size={28} color="#944EB1" /> },
    { key: 'vegan',       label: 'Vegan',        icon: <MaterialCommunityIcons name="leaf" size={28} color="#944EB1" /> },
    { key: 'glutenFree',  label: 'Gluten Free',  icon: <FontAwesome6 name="jar-wheat" size={28} color="#944EB1" /> },
  ];

  const toggleFilter = (key) => {
    setSelectedFilters(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const onSubmitSearch = () => {
    // Results is in the parent Stack, so navigate via parent
    navigation.getParent()?.navigate('Results', { query, filters: selectedFilters });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' }}
        style={styles.headerBg}
        imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      >
        <View style={styles.headerImageOverlay} pointerEvents="none" />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>FitRecipes</Text>
        </View>
      </ImageBackground>

      {/* Search Bar */}
      <View style={styles.searchBarOuter}>
        <View style={styles.searchBarMockup}>
          <TextInput
            placeholder="Search Recipes"
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={onSubmitSearch}
            style={styles.searchInputMockup}
          />
          <TouchableOpacity onPress={onSubmitSearch} style={styles.searchIconMockup}>
            <Ionicons name="search" size={22} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={{ height: 90, marginTop: 12, marginBottom: 8, paddingHorizontal: 24 }}>
        <FlatList
          data={FILTERS}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const selected = selectedFilters.includes(item.key);
            return (
              <View style={{ alignItems: 'center', marginRight: 18 }}>
                <TouchableOpacity
                  onPress={() => toggleFilter(item.key)}
                  style={[styles.filterCircle, selected && styles.filterCircleSelected]}
                  activeOpacity={0.7}
                >
                  {item.icon}
                </TouchableOpacity>
                <Text style={styles.filterLabel}>{item.label}</Text>
              </View>
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 2 }}
        />
      </View>

      {/* Sections */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.featuredLabel}>Featured Recipes</Text>
        <FlatList
          data={FEATURED_RECIPES}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
              style={styles.featuredCardHorizontal}
              activeOpacity={0.8}
            >
              <View style={{ position: 'relative' }}>
                <Image source={{ uri: item.image }} style={styles.featuredImage} />
                {favIds.has(String(item.id)) && (
                  <Ionicons name="bookmark" size={18} color="#6BB14E" style={styles.bookmarkBadge} />
                )}
              </View>
              <Text style={styles.featuredTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 8 }}
        />

        <Text style={styles.featuredLabel}>Highest Rated Recipes</Text>
        <FlatList
          data={HIGHEST_RATED_RECIPES}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
              style={styles.featuredCardHorizontal}
              activeOpacity={0.8}
            >
              <View style={{ position: 'relative' }}>
                <Image source={{ uri: item.image }} style={styles.featuredImage} />
                {favIds.has(String(item.id)) && (
                  <Ionicons name="bookmark" size={18} color="#6BB14E" style={styles.bookmarkBadge} />
                )}
              </View>
              <Text style={styles.featuredTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 8 }}
        />

        {/* Temporary test button */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('RecipeDetail', {
              recipe: {
                id: '1',
                title: 'Grilled Chicken and Salad',
                image: 'https://images.unsplash.com/photo-1662192512691-2786c53eca40?q=80&w=388&auto=format&fit=crop',
                protein: 35, calories: 400, carbs: 40, fat: 10, vegan: false, glutenFree: true,
              }
            })
          }
          style={{ marginTop: 30, marginBottom: 60, backgroundColor: '#6BB14E', padding: 14, borderRadius: 10, alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Go to RecipeDetail</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerBg: { height: 200, paddingHorizontal: 24, justifyContent: 'flex-end', alignItems: 'center' },
  headerImageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.60)', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, zIndex: 1 },
  headerTitleContainer: { zIndex: 2, width: '100%', alignItems: 'center', paddingBottom: 16 },
  headerTitle: { fontSize: 100, color: '#944EB1', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 6, fontFamily: 'Carattere_400Regular' },
  searchBarOuter: { paddingHorizontal: 16, marginTop: -24, marginBottom: 12, zIndex: 3 },
  searchBarMockup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 30, paddingHorizontal: 18, height: 48, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  searchInputMockup: { flex: 1, fontSize: 16, color: '#333', backgroundColor: 'transparent' },
  searchIconMockup: { marginLeft: 10 },
  filterCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#6BB14E', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  filterCircleSelected: { borderWidth: 2, borderColor: '#944EB1' },
  filterLabel: { fontSize: 12, color: '#333', textAlign: 'center' },
  featuredLabel: { fontSize: 18, fontWeight: 'bold', color: '#944EB1', marginBottom: 12, marginTop: 8 },
  featuredImage: { width: 90, height: 70, borderRadius: 10, marginBottom: 8, resizeMode: 'cover' },
  featuredTitle: { fontSize: 14, color: '#222222', textAlign: 'center', fontWeight: '500' },
  featuredCardHorizontal: { backgroundColor: '#F5F5F5', borderRadius: 14, alignItems: 'center', marginRight: 14, padding: 10, width: 120, minHeight: 120 },
  bookmarkBadge: { position: 'absolute', top: 6, right: 6 },
});
