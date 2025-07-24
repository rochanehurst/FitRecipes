import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const MOCK_RECIPE = {
  id: '1',
  title: 'Grilled Chicken Bowl',
  image: 'https://spoonacular.com/recipeImages/1-312x231.jpg',
  protein: 35,
  calories: 420,
  carbs: 40,
  fat: 10,
  ingredients: ['Chicken breast', 'Brown rice', 'Broccoli', 'Olive oil', 'Spices'],
  instructions: [
    'Grill the chicken until cooked through.',
    'Cook brown rice as per package instructions.',
    'Steam broccoli.',
    'Assemble bowl and drizzle with olive oil and spices.'
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

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Image source={{ uri: MOCK_RECIPE.image }} style={styles.image} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={{ fontSize: 18 }}>{'← Back'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{MOCK_RECIPE.title}</Text>
      <Text style={styles.macros}>
        Protein: {MOCK_RECIPE.protein}g | Calories: {MOCK_RECIPE.calories} | Carbs: {MOCK_RECIPE.carbs}g | Fat: {MOCK_RECIPE.fat}g
      </Text>
      <TouchableOpacity onPress={handleFavorite} style={styles.favoriteBtn} disabled={loading}>
        <Text style={{ fontSize: 18 }}>{isFavorite ? '♥ Remove Favorite' : '♡ Add to Favorites'}</Text>
      </TouchableOpacity>
      <Text style={styles.section}>Ingredients</Text>
      <FlatList
        data={MOCK_RECIPE.ingredients}
        keyExtractor={item => item}
        renderItem={({ item }) => <Text>- {item}</Text>}
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.section}>Instructions</Text>
      <FlatList
        data={MOCK_RECIPE.instructions}
        keyExtractor={item => item}
        renderItem={({ item, index }) => <Text>{index + 1}. {item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    marginBottom: 12,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  macros: {
    fontSize: 16,
    marginBottom: 12,
  },
  favoriteBtn: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  section: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
}); 