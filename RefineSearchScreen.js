// RefineSearchScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, SimpleLineIcons, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

const FILTERS = [
  { key: 'highProtein', label: 'High Protein', icon: <Ionicons name="barbell" size={22} color="#944EB1" /> },
  { key: 'LowCarb',     label: 'Low Carb',     icon: <SimpleLineIcons name="energy" size={22} color="#944EB1" /> },
  { key: 'lowCalorie',  label: 'Low Calorie',  icon: <FontAwesome6 name="bowl-rice" size={22} color="#944EB1" /> },
  { key: 'vegan',       label: 'Vegan',        icon: <MaterialCommunityIcons name="leaf" size={22} color="#944EB1" /> },
  { key: 'glutenFree',  label: 'Gluten Free',  icon: <FontAwesome6 name="jar-wheat" size={22} color="#944EB1" /> },
];

export default function RefineSearchScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const startQuery = route.params?.query ?? '';
  const startFlags = route.params?.filters ?? {};
  const startSelected = useMemo(
    () => Object.keys(startFlags).filter(k => !!startFlags[k]),
    [startFlags]
  );

  const [query, setQuery] = useState(startQuery);
  const [selected, setSelected] = useState(startSelected);

  const toggle = (key) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const onApply = () => {
    navigation.navigate('Results', { query, filters: selected });
  };

  const onClearAll = () => {
    setQuery('');
    setSelected([]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginRight: 6 }}>
          <Ionicons name="arrow-back" size={22} color="#944EB1" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: '700' }}>Refine Search</Text>
        </View>
        <TouchableOpacity onPress={onClearAll} style={{ padding: 8 }}>
          <Text style={{ color: '#944EB1', fontWeight: '700' }}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={{
        marginHorizontal: 16, marginTop: 8, marginBottom: 12,
        backgroundColor: '#fff', borderRadius: 30, paddingHorizontal: 18, height: 48,
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
        flexDirection: 'row', alignItems: 'center'
      }}>
        <TextInput
          placeholder="Search Recipes"
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          style={{ flex: 1, fontSize: 16, color: '#333' }}
        />
        <Ionicons name="search" size={20} color="#888" />
      </View>

      {/* Chips */}
      <View style={{ height: 90, marginTop: 12, marginBottom: 8, paddingHorizontal: 24 }}>
        <FlatList
          data={FILTERS}
          keyExtractor={item => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSel = selected.includes(item.key);
            return (
              <View style={{ alignItems: 'center', marginRight: 18 }}>
                <TouchableOpacity
                  onPress={() => toggle(item.key)}
                  style={[
                    { width: 60, height: 60, borderRadius: 30, backgroundColor: '#6BB14E',
                      justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
                    isSel && { borderWidth: 2, borderColor: '#944EB1' }
                  ]}
                  activeOpacity={0.7}
                >
                  {item.icon}
                </TouchableOpacity>
                <Text style={{ fontSize: 12, color: '#333', textAlign: 'center' }}>{item.label}</Text>
              </View>
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 2 }}
        />
      </View>

      {/* Apply */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <TouchableOpacity
          onPress={onApply}
          style={{ backgroundColor: '#6BB14E', borderRadius: 10, paddingVertical: 14, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
