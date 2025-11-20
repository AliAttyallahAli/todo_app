import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { productsAPI } from '../services/products';
import ProductCard from '../components/products/ProductCard';
import styles, { colors, spacing, typography } from '../styles/global';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Chargement des produits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.card, { marginBottom: 0 }]}>
        <Text style={typography.h1}>Marketplace</Text>
        <Text style={[typography.bodySmall, styles.mbMd]}>
          Découvrez les produits locaux
        </Text>

        {/* Barre de recherche */}
        <TextInput
          style={styles.input}
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Liste des produits */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={{ padding: spacing.md }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={typography.body}>Aucun produit trouvé</Text>
          </View>
        }
      />
    </View>
  );
};

export default Marketplace;