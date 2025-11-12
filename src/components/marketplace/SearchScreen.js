import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { productsAPI } from '../../services/products';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    // Charger les recherches récentes depuis le stockage local
    const recent = []; // À implémenter avec AsyncStorage
    setRecentSearches(recent);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await productsAPI.search(searchQuery, selectedCategory);
      setResults(response.data.products || []);
      
      // Sauvegarder la recherche
      saveSearch(searchQuery);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = (query) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    // Sauvegarder dans AsyncStorage
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  const ProductCard = ({ product }) => (
    <TouchableOpacity
      style={[globalStyles.card, { marginBottom: 12 }]}
      onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
    >
      <View style={globalStyles.row}>
        <View style={{ width: 80, height: 80, backgroundColor: colors.border, borderRadius: 8, marginRight: 12 }} />
        
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.text} numberOfLines={2}>{product.nom}</Text>
          <Text style={[globalStyles.textLight, { fontSize: 14 }]}>{product.categorie}</Text>
          <Text style={[globalStyles.subtitle, { color: colors.primary, marginTop: 4 }]}>
            {product.prix?.toLocaleString()} FCFA
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategoryChip = ({ category, isSelected }) => (
    <TouchableOpacity
      style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          marginRight: 8,
          marginBottom: 8,
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderWidth: 1,
          borderColor: isSelected ? colors.primary : colors.border,
        }
      ]}
      onPress={() => setSelectedCategory(isSelected ? '' : category)}
    >
      <Text style={{
        color: isSelected ? '#fff' : colors.text,
        fontSize: 14,
        fontWeight: '500',
      }}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      {/* Barre de recherche */}
      <View style={[globalStyles.card, { marginBottom: 0 }]}>
        <View style={globalStyles.row}>
          <TextInput
            style={[globalStyles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity
              style={{ marginLeft: 8 }}
              onPress={clearSearch}
            >
              <Text style={{ fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ marginLeft: 8 }}
              onPress={handleSearch}
            >
              <Text style={{ fontSize: 20 }}>🔍</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtres de catégorie */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        {PRODUCT_CATEGORIES.slice(0, 8).map(category => (
          <CategoryChip
            key={category}
            category={category}
            isSelected={selectedCategory === category}
          />
        ))}
      </ScrollView>

      {/* Résultats ou suggestions */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <ScrollView style={{ padding: 16 }}>
          {/* Recherches récentes */}
          {recentSearches.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={globalStyles.subtitle}>Recherches récentes</Text>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                  onPress={() => {
                    setSearchQuery(search);
                    handleSearch();
                  }}
                >
                  <Text style={globalStyles.text}>🔍 {search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Catégories populaires */}
          <View>
            <Text style={globalStyles.subtitle}>Catégories populaires</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
              {PRODUCT_CATEGORIES.slice(0, 12).map(category => (
                <TouchableOpacity
                  key={category}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: colors.border,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                  onPress={() => {
                    setSelectedCategory(category);
                    setSearchQuery(category);
                    handleSearch();
                  }}
                >
                  <Text style={globalStyles.text}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default SearchScreen;