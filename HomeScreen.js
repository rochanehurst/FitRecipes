import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';

const FEATURED_RECIPES = [
  {
    id: '1',
    title: 'Grilled Chicken Bowl',
    image: 'https://spoonacular.com/recipeImages/1-312x231.jpg',
    protein: 35,
    calories: 420,
    carbs: 40,
    fat: 10,
  },
  {
    id: '2',
    title: 'Salmon & Quinoa',
    image: 'https://spoonacular.com/recipeImages/2-312x231.jpg',
    protein: 30,
    calories: 390,
    carbs: 35,
    fat: 12,
  },
];

export default function HomeScreen({ navigation }) {
  const [protein, setProtein] = useState(20);
  const [calories, setCalories] = useState(400);
  const [query, setQuery] = useState('');

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Find Recipes</Text>
      <TextInput
        placeholder="Search by ingredient (e.g. chicken)"
        value={query}
        onChangeText={setQuery}
        style={{ borderWidth: 1, borderRadius: 8, marginBottom: 24, padding: 8 }}
      />
      <Text>Protein (g/serving): {protein}</Text>
      <TextInput
        keyboardType="numeric"
        value={protein.toString()}
        onChangeText={v => setProtein(Number(v))}
        style={{ borderWidth: 1, borderRadius: 8, marginBottom: 12, padding: 8 }}
      />
      <Text>Calories (per serving): {calories}</Text>
      <TextInput
        keyboardType="numeric"
        value={calories.toString()}
        onChangeText={v => setCalories(Number(v))}
        style={{ borderWidth: 1, borderRadius: 8, marginBottom: 12, padding: 8 }}
      />
      <Button title="Search" onPress={() => navigation.navigate('Results', { query, protein, calories })} />
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 24 }}>Featured Recipes</Text>
      <FlatList
        data={FEATURED_RECIPES}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}>
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <Text>Protein: {item.protein}g</Text>
              <Text>Calories: {item.calories}</Text>
            </View>
          </TouchableOpacity>
        )}
        style={{ marginBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
}); 