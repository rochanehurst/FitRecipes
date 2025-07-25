import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_RECIPE = {
  id: '1',
  title: 'Grilled Chicken and Salad',
  image: 'https://images.unsplash.com/photo-1662192512691-2786c53eca40?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  protein: 35,
  calories: 400,
  carbs: 40,
  fat: 10,
  vegan: false,
  glutenFree: true,
  ingredients: ['Chicken breast', 'Brown rice', 'Broccoli', 'Olive oil', 'Spices'],
  instructions: [
    'Prep chicken: Rub chicken breast with olive oil, garlic powder, paprika, salt, pepper, and lemon juice.',
    'Grill: Cook chicken on grill pan or outdoor grill for ~5–6 minutes per side or until fully cooked. Let it rest, then slice.',
    'Make dressing: Whisk dressing ingredients in a small bowl.',
    'Assemble salad: Toss greens, cucumber, tomatoes, avocado, seeds, and cheese (if using) in a bowl.',
    'Top: Add sliced grilled chicken on top, drizzle with dressing. Enjoy!'
  ],
};

export default function RecipeDetailScreen({ navigation }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFavorite = () => {
    setLoading(true);
    setTimeout(() => {
      setIsFavorite(!isFavorite);
      setLoading(false);
    }, 300);
  };

  // Get status bar height for proper offset
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44;
  const topBarHeight = statusBarHeight + 20;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Status Bar and Solid Color Bar */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: topBarHeight, backgroundColor: '#333333', zIndex: 10 }} pointerEvents="none" />
      
      {/* Static Header Section */}
      <View style={[styles.header, { marginTop: topBarHeight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#944EB1" />
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerCenterText}>Save to Favorites</Text>
          <Ionicons name="bookmark" size={20} color="#6BB14E" style={styles.bookmarkIcon} />
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* Static Recipe Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: MOCK_RECIPE.image }} style={styles.recipeImage} />
      </View>

      {/* Static Nutritional Section */}
      <View style={styles.nutritionalSection}>
        <Text style={styles.recipeTitle}>{MOCK_RECIPE.title}</Text>
        <Text style={styles.nutritionalInfo}>
          Protein: {MOCK_RECIPE.protein}g | Calories: {MOCK_RECIPE.calories} | Carbs: {MOCK_RECIPE.carbs}g | Fat: {MOCK_RECIPE.fat}g
        </Text>
        <Text style={styles.dietaryInfo}>
          Vegan: {MOCK_RECIPE.vegan ? 'Yes' : 'No'} | Gluten Free: {MOCK_RECIPE.glutenFree ? 'Yes' : 'No'}
        </Text>
      </View>

      {/* Scrollable Content - Ingredients and Instructions */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.subsectionTitle}>For the chicken:</Text>
          <FlatList
            data={['1 boneless, skinless chicken breast', '1 tbsp olive oil', '1 tsp garlic powder', '½ tsp smoked paprika', 'Salt & pepper to taste', 'Squeeze of lemon juice']}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.bulletPoint}>• {item}</Text>}
            scrollEnabled={false}
          />
          
          <Text style={styles.subsectionTitle}>For the salad:</Text>
          <FlatList
            data={['2 cups mixed greens (e.g., arugula, spinach, romaine)', '½ cucumber, sliced', '5 cherry tomatoes, halved', '¼ avocado, sliced', '1 tbsp pumpkin seeds or sunflower seeds (optional crunch)', 'Optional: 1 tbsp crumbled goat cheese or feta']}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.bulletPoint}>• {item}</Text>}
            scrollEnabled={false}
          />
          
          <Text style={styles.subsectionTitle}>For the dressing (gluten-free):</Text>
          <FlatList
            data={['1 tbsp olive oil']}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.bulletPoint}>• {item}</Text>}
            scrollEnabled={false}
          />
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <FlatList
            data={MOCK_RECIPE.instructions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => <Text style={styles.instructionStep}>{index + 1}. {item}</Text>}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#944EB1',
    fontWeight: '500',
    marginLeft: 4,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerCenterText: {
    fontSize: 14,
    color: '#944EB1',
    fontWeight: '500',
  },
  bookmarkIcon: {
    marginTop: 2,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 0,
    backgroundColor: '#F9F9F9',
  },
  recipeImage: {
    width: 420,
    height: 200,
    // borderRadius: 110,
    resizeMode: 'cover',
  },
  nutritionalSection: {
    backgroundColor: '#E8F5E8',
    padding: 20,
    marginHorizontal: 0,
    marginTop: 0,
    borderRadius: 12,
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
    textAlign: 'center',
  },
  nutritionalInfo: {
    fontSize: 14,
    color: '#222222',
    marginBottom: 4,
    textAlign: 'center',
  },
  dietaryInfo: {
    fontSize: 14,
    color: '#222222',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginTop: 12,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#222222',
    marginBottom: 4,
    paddingLeft: 8,
  },
  instructionStep: {
    fontSize: 14,
    color: '#222222',
    marginBottom: 8,
    lineHeight: 20,
  },
}); 