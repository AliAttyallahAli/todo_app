import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { productsAPI } from '../../services/products';

const MarketplaceScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { id: 'all', name: 'Tous', icon: '🛍️' },
    { id: 'alimentation', name: 'Alimentation', icon: '🍎' },
    { id: 'habillement', name: 'Habillement', icon: '👕' },
    { id: 'electronique', name: 'Électronique', icon: '📱' },
    { id: 'artisanat', name: 'Artisanat', icon: '🎨' },
    { id: 'agriculture', name: 'Agriculture', icon: '🌾' },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll(20);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const ProductCard = ({ product }) => (
    <TouchableOpacity
      style={[
        globalStyles.card,
        {
          width: '48%',
          marginBottom: 12,
        }
      ]}
      onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
    >
      <View style={{ height: 120, backgroundColor: colors.border, borderRadius: 8, marginBottom: 8 }} />
      
      <Text style={[globalStyles.text, { fontSize: 14 }]} numberOfLines={2}>
        {product.nom}
      </Text>
      
      <Text style={[globalStyles.textLight, { fontSize: 12 }]} numberOfLines={1}>
        {product.categorie}
      </Text>
      
      <Text style={[globalStyles.subtitle, { color: colors.primary, marginTop: 4, fontSize: 16 }]}>
        {product.prix?.toLocaleString()} FCFA
      </Text>
      
      <View style={[globalStyles.row, { marginTop: 8 }]}>
        <Text style={[globalStyles.textLight, { fontSize: 12 }]}>
          Par {product.vendeur_prenom}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const CategoryButton = ({ category }) => (
    <TouchableOpacity
      style={[
        globalStyles.center,
        {
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
          marginRight: 8,
        }
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Text style={{ fontSize: 16, marginRight: 4 }}>{category.icon}</Text>
      <Text style={[
        globalStyles.text,
        { 
          fontSize: 14,
          color: selectedCategory === category.id ? '#fff' : colors.text 
        }
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      {/* Barre de recherche */}
      <View style={[globalStyles.card, { marginBottom: 0 }]}>
        <TextInput
          style={globalStyles.input}
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Catégories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 16, marginVertical: 12 }}
      >
        {categories.map(category => (
          <CategoryButton key={category.id} category={category} />
        ))}
      </ScrollView>

      {/* Liste des produits */}
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default MarketplaceScreen;