import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, StatusBar, Platform } from 'react-native';
import { Ionicons, SimpleLineIcons, FontAwesome, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Carattere_400Regular } from '@expo-google-fonts/carattere';
import * as Font from 'expo-font';



const FEATURED_RECIPES = [
  {
    id: '1',
    title: 'Grilled Chicken and Salad',
    image: 'https://images.unsplash.com/photo-1662192512691-2786c53eca40?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '2',
    title: 'Chickpea Curry',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    title: 'English Breakfast',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '4',
    title: 'Tomato Soup',
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '5',
    title: 'Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '6',
    title: 'Fruit Parfait',
    image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
  },
  // Add up to 10 items if needed
].slice(0, 10);

const HIGHEST_RATED_RECIPES = [
  {
    id: '101',
    title: 'Avocado Toast',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '102',
    title: 'Berry Smoothie',
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '103',
    title: 'Quinoa Salad',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '104',
    title: 'Egg Muffins',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '105',
    title: 'Greek Yogurt Bowl',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '106',
    title: 'Veggie Stir Fry',
    image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
  },
  // Add up to 10 items if needed
].slice(0, 10);

export default function HomeScreen({ navigation }) {
  const [protein, setProtein] = useState(20);
  const [calories, setCalories] = useState(400);
  const [query, setQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [activeTab, setActiveTab] = useState('Home');



  const [fontsLoaded] = useFonts({
    Carattere_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }
  

  const FILTERS = [
    {
      key: 'highProtein',
      label: 'High Protein',
      icon: <Ionicons name="barbell" size={28} color="#944EB1" />,
    },
    {
      key: 'LowCarb',
      label: 'Low Carb',
      icon: <FontAwesome6 name="bowl-rice" size={28} color="#944EB1" />,
    },
    {
      key: 'lowCalorie',
      label: 'Low Calorie',
      icon: <SimpleLineIcons name="energy" size={28} color="#944EB1" />,
    },
    {
      key: 'vegan',
      label: 'Vegan',
      icon: <MaterialCommunityIcons name="leaf" size={28} color="#944EB1" />,
    },
    {
      key: 'glutenFree',
      label: 'Gluten Free',
      icon: <FontAwesome6 name="jar-wheat" size={28} color="#944EB1" />,
    },
  ];

  const toggleFilter = (key) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Get status bar height for proper offset
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
  const topBarHeight = statusBarHeight + 20;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Status Bar and Solid Color Bar */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: topBarHeight, backgroundColor: '#333333', zIndex: 10 }} pointerEvents="none" />
      {/* Header Section */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' }}
        style={[styles.headerBg, { marginTop: topBarHeight }]}
        imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      >
        {/* Semi-transparent overlay for image opacity */}
        <View style={styles.headerImageOverlay} pointerEvents="none" />
        {/* Top Icons */}
        <View style={styles.headerIconsRow}>
          {/* Removed bookmark and person icons */}
        </View>
        {/* Title */}
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
            style={styles.searchInputMockup}
          />
          <Ionicons name="search" size={22} color="#888" style={styles.searchIconMockup} />
        </View>
      </View>
      {/* Category Filter Row */}
      <View style={{ height: 90, marginTop: 12, marginBottom: 8, paddingHorizontal: 24 }}>
        <FlatList
          data={FILTERS}
          keyExtractor={item => item.key}
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
      {/* Scrollable Recipe Sections */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        {/* Featured Recipes Section - Horizontal */}
        <Text style={styles.featuredLabel}>Featured Recipes</Text>
        <FlatList
          data={FEATURED_RECIPES}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('RecipeDetail', { recipe : item })}
              style={styles.featuredCardHorizontal}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.image }} style={styles.featuredImage} />
              <Text style={styles.featuredTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 8 }}
        />
        {/* Highest Rated Recipes Section - Horizontal */}
        <Text style={styles.featuredLabel}>Highest Rated Recipes</Text>
        <FlatList
          data={HIGHEST_RATED_RECIPES}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
              style={styles.featuredCardHorizontal}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.image }} style={styles.featuredImage} />
              <Text style={styles.featuredTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 8 }}
        />
        {/* Temporary Navigation Button for Testing */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RecipeDetail', {
                recipe: {
                id: '1',
                title: 'Grilled Chicken and Salad',
                image: 'https://images.unsplash.com/photo-1662192512691-2786c53eca40?q=80&w=388&auto=format&fit=crop',
                protein: 35,
                calories: 400,
                carbs: 40,
                fat: 10,
                vegan: false,
                glutenFree: true,
              }})
            }
            style={{
              marginTop: 30,
              marginBottom: 60,
              backgroundColor: '#6BB14E',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Go to RecipeDetail</Text>
          </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBg: {
    height: 200,
    // marginTop is set dynamically
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.60)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 1,
  },
  headerIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    zIndex: 2,
  },
  // Removed headerIconLeft and headerIconRight styles
  // headerTitleContainer: {
  //   backgroundColor: 'rgba(244, 244, 244, 0.8)',
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 20,
  //   zIndex: 2,
  // },
  headerTitle: {
    fontSize: 100,
    color: '#944EB1',
    paddingBottom: 50,
    paddingRight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
    zIndex: 2,
    fontFamily: 'Carattere_400Regular',
  },
  
  searchBarOuter: {
    paddingHorizontal: 16,
    marginTop: -24,
    marginBottom: 12,
    zIndex: 3,
  },
  searchBarMockup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 18,
    height: 48,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInputMockup: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  searchIconMockup: {
    marginLeft: 10,
  },
  filterCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6BB14E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterCircleSelected: {
    borderWidth: 2,
    borderColor: '#944EB1',
  },
  filterLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  featuredLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#944EB1',
    marginBottom: 12,
    marginTop: 8,
  },
  featuredCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 18,
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    minWidth: 140,
    maxWidth: '48%',
  },
  featuredImage: {
    width: 90,
    height: 70,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  featuredTitle: {
    fontSize: 14,
    color: '#222222',
    textAlign: 'center',
    fontWeight: '500',
  },
  featuredCardHorizontal: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 14,
    padding: 10,
    width: 120,
    minHeight: 120,
  },
}); 