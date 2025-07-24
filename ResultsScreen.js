import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const MOCK_RECIPES = [
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

export default function ResultsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Recipe Results</Text>
      <FlatList
        data={MOCK_RECIPES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}>
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>Protein: {item.protein}g</Text>
                <Text>Calories: {item.calories}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No recipes found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
});
