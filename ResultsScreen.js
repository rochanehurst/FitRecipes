import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchRecipes } from './data/search';

const SORTS = [
  { key: 'relevance',    label: 'Relevance' },
  { key: 'rating_desc',  label: 'Highest Rated' },
  { key: 'staff_picks',  label: 'Staff Picks' },   // expects item.staffPick === true
  { key: 'protein_desc', label: 'Highest Protein' },
];

export default function ResultsScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { query = '', filters = [] } = route.params || {};
  const initialFlags = useMemo(
    () => (Array.isArray(filters)
      ? Object.fromEntries(filters.map(k => [k, true]))
      : (filters || {})),
    [filters]
  );

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [filterFlags, setFilterFlags] = useState(initialFlags);

  const [sortKey, setSortKey] = useState('relevance');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await searchRecipes({ query, filters: filterFlags });
        if (alive) setResults(data || []);
      } catch {
        if (alive) setResults([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [query, JSON.stringify(filterFlags)]);

  const displayResults = useMemo(() => {
    const copy = [...results];
    switch (sortKey) {
      case 'rating_desc':
        copy.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
        break;
      case 'protein_desc':
        copy.sort((a, b) => (b.protein ?? -1) - (a.protein ?? -1));
        break;
      case 'staff_picks':
        copy.sort((a, b) => (b?.staffPick === true) - (a?.staffPick === true));
        break;
      default: // relevance
        break;
    }
    return copy;
  }, [results, sortKey]);

  const activeFilterEntries = Object.entries(filterFlags).filter(([, v]) => !!v);
  const sortChipLabel = SORTS.find(s => s.key === sortKey)?.label ?? 'Relevance';

  // --- Header UI (always visible, not inside FlatList) ---
  const Header = (
    <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 8 }}>
      {/* top row */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 8, marginRight: 6 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color="#944EB1" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: '700' }}>Results</Text>
          {!!query && <Text style={{ color: '#666' }}>for “{query}”</Text>}
          <Text style={{ color: '#888', marginTop: 2 }}>
            {displayResults.length} result{displayResults.length === 1 ? '' : 's'}
          </Text>
        </View>


        <Pressable
          onPress={() => navigation.navigate('RefineSearch', {
            query,
            filters: filterFlags,   // prefill chips on Refine screen
          })}
          style={{ padding: 8, marginRight: 6 }}
          accessibilityRole="button"
          accessibilityLabel="Refine search"
        >
          <Text style={{ color: '#944EB1', fontWeight: '600' }}>Refine</Text>
        </Pressable>


        {/* funnel only */}
        <Pressable
          onPress={() => setSortOpen(true)}
          style={{ padding: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Change sort"
        >
          <Ionicons name="funnel" size={20} color="#944EB1" />
        </Pressable>
      </View>

      {/* chips row */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, alignItems: 'center' }}>
        {activeFilterEntries.map(([k]) => (
          <View
            key={k}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F1E7F7',
              borderRadius: 16,
              paddingVertical: 6,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: '#944EB1', fontWeight: '600', fontSize: 12 }}>{k}</Text>
            <Pressable
              hitSlop={8}
              onPress={() => {
                const next = { ...filterFlags };
                delete next[k];
                setFilterFlags(next);
              }}
              style={{ marginLeft: 6 }}
              accessibilityLabel={`Remove ${k}`}
            >
              <Text style={{ color: '#944EB1', fontWeight: '900' }}>×</Text>
            </Pressable>
          </View>
        ))}

        {/* sort chip */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F1E7F7',
            borderRadius: 16,
            paddingVertical: 6,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ color: '#944EB1', fontWeight: '600', fontSize: 12 }}>
            {sortChipLabel}
          </Text>
          {sortKey !== 'relevance' && (
            <Pressable
              hitSlop={8}
              onPress={() => setSortKey('relevance')}
              style={{ marginLeft: 6 }}
              accessibilityLabel="Clear sort"
            >
              <Text style={{ color: '#944EB1', fontWeight: '900' }}>×</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* overlay sort menu */}
      {sortOpen && (
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
      )}

      {/* header (fixed) */}
      {Header}

      {/* body */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : displayResults.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>No recipes found.</Text>
        </View>
      ) : (
        <FlatList
          data={displayResults}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingTop: 0 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                {item.image ? (
                  <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 12 }} />
                ) : null}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', marginBottom: 4 }}>{item.title}</Text>
                  {typeof item.protein === 'number' && <Text>Protein: {item.protein}g</Text>}
                  {typeof item.calories === 'number' && <Text>Calories: {item.calories}</Text>}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
