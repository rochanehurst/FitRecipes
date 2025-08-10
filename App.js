// App.js
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

const RootStack = createNativeStackNavigator();
const SearchStackNav = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SearchStack() {
  return (
    <SearchStackNav.Navigator screenOptions={{ headerShown: false }}>
      <SearchStackNav.Screen name="RefineSearch" component={RefineSearchScreen} />
      <SearchStackNav.Screen name="Results" component={ResultsScreen} />
      {/* optional: if you want detail inside the tab stack, add this: */}
      {/* <SearchStackNav.Screen name="RecipeDetail" component={RecipeDetailScreen} /> */}
    </SearchStackNav.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Favorites') iconName = focused ? 'bookmark' : 'bookmark-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6BB14E',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontWeight: '500', fontSize: 12 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        {/* Keep only global screens here */}
        <RootStack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        <RootStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
