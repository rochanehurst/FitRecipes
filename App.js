import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import ResultsScreen from './ResultsScreen';
import RecipeDetailScreen from './RecipeDetailScreen';
import FavoritesScreen from './FavoritesScreen';
import AccountScreen from './AccountScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RefineSearchScreen from './RefineSearchScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens for Search, Profile if not already present
function SearchScreen() {
  return null;
}
function ProfileScreen() {
  return null;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Favorites') {
            iconName = 'bookmark';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6BB14E',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontWeight: '500', fontSize: 12 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="RefineSearch" component={RefineSearchScreen} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
