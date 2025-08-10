// ResultsScreen.js
import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, Platform, Pressable, StyleSheet
} from 'react-native';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchRecipes } from './data/search';

const SORTS = [
  { key: 'relevance',    label: 'Relevance' },
  { key: 'rating_desc',  label: 'Highest Rated' },
  { key: 'staff_picks',  label: 'Staff Picks' },
  { key: 'protein_desc', label: 'Highest Protein' },
];

export default function ResultsScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { query = '', filters = {}, sort = 'relevance' } = route.params ?? {};
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  // sort state (controlled by funnel)
  const [sortKey, setSortKey] = useState(sort);
  const [sortOpen, setSortOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await searchRecipes({ query, filters, sort: sortKey, limit: 50, offset: 0 });
      setRecipes(data);
    } finally {
      setLoading(false);
    }
  }, [query, JSON.stringify(filters), sortKey]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => { load(); }, [sortKey, load]); // re-fetch when sort changes

  const HeaderBar = () => (
    <View style={{
      flexDirection:'row', alignItems:'center', justifyContent:'space-between',
      paddingHorizontal:12, paddingTop:4, paddingBottom:8, backgroundColor:'#fff'
    }}>
      {/* Back */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding:8 }}>
        <Ionicons name="arrow-back" size={22} color="#944EB1" />
      </TouchableOpacity>

      {/* Title */}
      <View style={{ flex:1, alignItems:'center' }}>
        <Text style={{ fontSize:18, fontWeight:'700' }}>
          {query ? `Results for “${query}”` : 'Results'}
        </Text>
      </View>

      {/* Refine (text) */}
      <Pressable
        onPress={() => navigation.navigate('RefineSearch', { query, filters })}
        style={{ padding:8, marginRight: 2 }}
        accessibilityLabel="Refine search"
      >
        <Text style={{ color:'#944EB1', fontWeight:'700' }}>Refine</Text>
      </Pressable>

      {/* Funnel (opens sort menu) */}
      <TouchableOpacity
        onPress={() => setSortOpen(true)}
        style={{ padding:8 }}
        accessibilityLabel="Open sort menu"
      >
        <Ionicons name="funnel-outline" size={22} color="#944EB1" />
      </TouchableOpacity>
    </View>
  );

  const Item = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      activeOpacity={0.8}
      style={{
        flexDirection:'row', gap:12, marginBottom:14, backgroundColor:'#F7F7F7',
        borderRadius:12, padding:10, marginHorizontal:16,
        ...Platform.select({
          ios: { shadowColor:'#000', shadowOpacity:0.08, shadowRadius:6, shadowOffset:{ width:0, height:2 } },
          android: { elevation:2 },
        })
      }}
    >
      {!!item.image && (
        <Image source={{ uri: item.image }} style={{ width:84, height:84, borderRadius:8, backgroundColor:'#ddd' }} />
      )}
      <View style={{ flex:1 }}>
        <Text style={{ fontWeight:'700' }} numberOfLines={1}>{item.title}</Text>
        {!!item.description && <Text style={{ color:'#666', marginTop:4 }} numberOfLines={2}>{item.description}</Text>}
        <View style={{ flexDirection:'row', flexWrap:'wrap', gap:10, marginTop:6 }}>
          {typeof item.calories === 'number' && <Text>{item.calories} kcal</Text>}
          {typeof item.protein === 'number' && <Text>{item.protein} g protein</Text>}
          {typeof item.carbs === 'number' && <Text>{item.carbs} g carbs</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex:1, backgroundColor:'#fff' }}>
        <HeaderBar />
        <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Loading recipes…</Text>
        </View>
        {sortOpen && <SortOverlay sortKey={sortKey} setSortKey={setSortKey} setSortOpen={setSortOpen} />}
      </SafeAreaView>
    );
  }

  if (!recipes.length) {
    return (
      <SafeAreaView style={{ flex:1, backgroundColor:'#fff' }}>
        <HeaderBar />
        <View style={{ flex:1, alignItems:'center', justifyContent:'center', padding:24 }}>
          <Text style={{ fontWeight:'700', fontSize:16, marginBottom:8 }}>No results</Text>
          <Text style={{ textAlign:'center', color:'#666' }}>
            Try removing some filters or searching a different term.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RefineSearch', { query, filters })}
            style={{ marginTop:16, backgroundColor:'#6BB14E', paddingVertical:12, paddingHorizontal:18, borderRadius:10 }}
          >
            <Text style={{ color:'#fff', fontWeight:'700' }}>Refine Filters</Text>
          </TouchableOpacity>
        </View>
        {sortOpen && <SortOverlay sortKey={sortKey} setSortKey={setSortKey} setSortOpen={setSortOpen} />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#fff' }}>
      <HeaderBar />
      <FlatList
        data={recipes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingTop:8, paddingBottom:24 }}
        ItemSeparatorComponent={() => <View style={{ height:12 }} />}
        renderItem={({ item }) => <Item item={item} />}
        onRefresh={load}
        refreshing={loading}
      />
      {sortOpen && <SortOverlay sortKey={sortKey} setSortKey={setSortKey} setSortOpen={setSortOpen} />}
    </SafeAreaView>
  );
}

/* -------- small sort overlay (opened by funnel) -------- */
function SortOverlay({ sortKey, setSortKey, setSortOpen }) {
  return (
    <Pressable
      onPress={() => setSortOpen(false)}
      style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 20 }]}
    >
      <Pressable
        onPress={() => {}}
        style={{
          position: 'absolute',
          top: 72,
          right: 12,
          backgroundColor: '#fff',
          borderRadius: 12,
          paddingVertical: 8,
          paddingHorizontal: 8,
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 4,
          width: 200,
          zIndex: 21,
        }}
      >
        {SORTS.map(opt => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => { setSortKey(opt.key); setSortOpen(false); }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderRadius: 8,
              backgroundColor: sortKey === opt.key ? '#F1E7F7' : 'transparent',
            }}
          >
            <Text style={{ color: '#944EB1', fontWeight: sortKey === opt.key ? '700' : '500' }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Pressable>
    </Pressable>
  );
}
