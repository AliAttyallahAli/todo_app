import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { useAuth } from '../../context/AuthContext';
import { productsAPI } from '../../services/products';

const HomeScreen = ({ navigation }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll(6);
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeaturedProducts();
    setRefreshing(false);
  };

  const QuickAction = ({ icon, title, color, onPress }) => (
    <TouchableOpacity
      style={[
        globalStyles.center,
        {
          width: 80,
          marginHorizontal: 8,
        }
      ]}
      onPress={onPress}
    >
      <View
        style={{
          width: 60,
          height: 60,
          backgroundColor: color,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 24 }}>{icon}</Text>
      </View>
      <Text style={[globalStyles.textLight, { textAlign: 'center', fontSize: 12 }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const ProductCard = ({ product }) => (
    <TouchableOpacity
      style={[
        globalStyles.card,
        {
          width: 160,
          marginRight: 12,
        }
      ]}
      onPress={() => navigation.navigate('Marketplace', {
        screen: 'ProductDetail',
        params: { productId: product.id }
      })}
    >
      <View style={{ height: 120, backgroundColor: colors.border, borderRadius: 8, marginBottom: 8 }} />
      <Text style={[globalStyles.text, { fontSize: 14 }]} numberOfLines={2}>
        {product.nom}
      </Text>
      <Text style={[globalStyles.subtitle, { color: colors.primary, marginTop: 4 }]}>
        {product.prix?.toLocaleString()} FCFA
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
        <Text style={[globalStyles.title, { color: '#fff' }]}>
          Bonjour, {user?.prenom} 👋
        </Text>
        <Text style={[globalStyles.textLight, { color: '#fff' }]}>
          Bienvenue sur ZouDou-Souk
        </Text>
      </View>

      {/* Actions Rapides */}
      <View style={[globalStyles.card, { marginTop: 0 }]}>
        <Text style={globalStyles.subtitle}>Actions Rapides</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
          <QuickAction
            icon="🛍️"
            title="Marketplace"
            color={colors.marketplace}
            onPress={() => navigation.navigate('Marketplace')}
          />
          <QuickAction
            icon="📤"
            title="Transfert"
            color={colors.secondary}
            onPress={() => navigation.navigate('Portefeuille', { screen: 'P2PTransfer' })}
          />
          <QuickAction
            icon="⚡"
            title="ZIZ"
            color={colors.ziz}
            onPress={() => navigation.navigate('Services')}
          />
          <QuickAction
            icon="💧"
            title="STE"
            color={colors.ste}
            onPress={() => navigation.navigate('Services')}
          />
          <QuickAction
            icon="📝"
            title="Blog"
            color={colors.accent}
            onPress={() => {/* Navigate to Blog */}}
          />
        </ScrollView>
      </View>

      {/* Produits Populaires */}
      <View style={globalStyles.card}>
        <View style={globalStyles.spaceBetween}>
          <Text style={globalStyles.subtitle}>Produits Populaires</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Marketplace')}>
            <Text style={[globalStyles.text, { color: colors.primary }]}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={featuredProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 16 }}
        />
      </View>

      {/* Services */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Services Disponibles</Text>
        
        <View style={{ marginTop: 16 }}>
          <TouchableOpacity
            style={[globalStyles.row, { padding: 16, backgroundColor: `${colors.ziz}20`, borderRadius: 8, marginBottom: 8 }]}
            onPress={() => navigation.navigate('Services')}
          >
            <Text style={{ fontSize: 24, marginRight: 12 }}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.text}>ZIZ - Électricité</Text>
              <Text style={globalStyles.textLight}>Paiement des factures</Text>
            </View>
            <Text style={{ color: colors.primary }}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.row, { padding: 16, backgroundColor: `${colors.ste}20`, borderRadius: 8, marginBottom: 8 }]}
            onPress={() => navigation.navigate('Services')}
          >
            <Text style={{ fontSize: 24, marginRight: 12 }}>💧</Text>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.text}>STE - Eau</Text>
              <Text style={globalStyles.textLight}>Paiement des factures</Text>
            </View>
            <Text style={{ color: colors.primary }}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.row, { padding: 16, backgroundColor: `${colors.tax}20`, borderRadius: 8 }]}
            onPress={() => navigation.navigate('Services')}
          >
            <Text style={{ fontSize: 24, marginRight: 12 }}>🏛️</Text>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.text}>Taxes Communales</Text>
              <Text style={globalStyles.textLight}>Paiement des taxes</Text>
            </View>
            <Text style={{ color: colors.primary }}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Devenir Vendeur */}
      {user?.role === 'client' && (
        <TouchableOpacity
          style={[
            globalStyles.card,
            { backgroundColor: `${colors.primary}10`, borderLeftWidth: 4, borderLeftColor: colors.primary }
          ]}
          onPress={() => {/* Navigate to vendor upgrade */}}
        >
          <View style={globalStyles.row}>
            <Text style={{ fontSize: 24, marginRight: 12 }}>🏪</Text>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.subtitle}>Devenir Vendeur</Text>
              <Text style={globalStyles.textLight}>
                Vendez vos produits sur ZouDou-Souk et atteignez plus de clients
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[globalStyles.button, { marginTop: 12, alignSelf: 'flex-start' }]}
          >
            <Text style={globalStyles.buttonText}>Commencer</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default HomeScreen;