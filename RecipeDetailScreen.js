import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isFavorite as isFav, toggleFavorite } from './favorites';



export default function RecipeDetailScreen( { route, navigation }) {
  //expect a full recipe obj in params
  const recipe = route?.params?.recipe;

  //fridnly guard if someone navigates here without data
  const hasData = !!recipe && !!recipe.title;

  //fav is local-only for now
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (recipe?.id) {
        const yes = await isFav(recipe.id);
        if (alive) setIsFavorite(yes);
      }
    })();
    return () => { alive = false; };
  }, [recipe?.id]);
  

  const topBarHeight = useMemo(() => {
    const statusBarHeight = Platform.OS === 'android'
      ? StatusBar.currentHeight || 24
      : 44;
    return statusBarHeight + 20;
  }, []);

  const NutritionalRow = () => (
    <View style={styles.nutritionalSection}>
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <Text style={styles.nutritionalInfo}>
          Protein: {recipe?.protein ?? '-'}g | Calories: {recipe?.calories ?? '-'}
          {typeof recipe?.carbs === 'number' ? ` | Carbs: ${recipe.carbs}g` : ''}
          {typeof recipe?.fat === 'number' ? ` | Fat: ${recipe.fat}g` : ''}
        </Text>
        <Text style={styles.dietaryInfo}>
          Vegan: {recipe?.vegan ? 'Yes' : 'No'} | Gluten Free: {recipe?.glutenFree ? 'Yes' : 'No'}
        </Text>
    </View>
    );

    if (!hasData) {
      return (
        <View style={{ flex: 1, paddingTop: topBarHeight, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, marginBottom: 12 }}>No recipe data was provided.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.fallbackBtn}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* Status Bar + top overlay */}
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: topBarHeight,
            backgroundColor: '#333333',
            zIndex: 10,
          }}
          pointerEvents="none"
        />
  
        {/* Header */}
        <View style={[styles.header, { marginTop: topBarHeight }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#944EB1" />
            <Text style={styles.headerButtonText}>Back</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
              onPress={async () => {
                if (!recipe?.id) return;
                const next = await toggleFavorite(recipe);
                const yes = next.some(r => String(r.id) === String(recipe.id));
                setIsFavorite(yes);
              }}
          >
            <Text style={styles.headerCenterText}>
              {isFavorite ? 'Saved' : 'Save to Favorites'}
            </Text>
            <Ionicons
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color="#6BB14E"
              style={styles.bookmarkIcon}
            />
          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
  
        {/* Hero image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.image || 'https://via.placeholder.com/800x400?Text=No+Image' }}
            style={styles.recipeImage}
          />
        </View>
  
        {/* Nutritional quick facts */}
        <NutritionalRow />
  
        {/* Scrollable content */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Ingredients */}
          {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <FlatList
                data={recipe.ingredients}
                keyExtractor={(item, index) => `${index}-${String(item)}`}
                renderItem={({ item }) => <Text style={styles.bulletPoint}>• {item}</Text>}
                scrollEnabled={false}
              />
            </View>
          )}
  
          {/* Instructions */}
          {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <FlatList
                data={recipe.instructions}
                keyExtractor={(item, index) => `${index}-${String(item)}`}
                renderItem={({ item, index }) => (
                  <Text style={styles.instructionStep}>{index + 1}. {item}</Text>
                )}
                scrollEnabled={false}
              />
            </View>
          )}
  
          {/* Spacer */}
          <View style={{ height: 28 }} />
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
    TextAlign: 'center',

    },
  nutritionalInfo: {
    fontSize: 14,
    color: '#222222',
    marginBottom: 4,
    TextAlign: 'center',

    },
  dietaryInfo: {
    fontSize: 14,
    color: '#222222',
    TextAlign: 'center',

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
  fallbackBtn: {
    backgroundColor: '#6BB14E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,

    },
});