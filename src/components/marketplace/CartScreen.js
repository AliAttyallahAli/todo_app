import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { useAuth } from '../../context/AuthContext';
import { storage, StorageKeys } from '../../services/storage';
import { walletAPI } from '../../services/wallet';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    const items = await storage.getItem(StorageKeys.CART_ITEMS) || [];
    setCartItems(items);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCartItems();
    setRefreshing(false);
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const updated = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updated);
    await storage.setItem(StorageKeys.CART_ITEMS, updated);
  };

  const removeFromCart = async (productId) => {
    const updated = cartItems.filter(item => item.id !== productId);
    setCartItems(updated);
    await storage.setItem(StorageKeys.CART_ITEMS, updated);
  };

  const clearCart = async () => {
    setCartItems([]);
    await storage.removeItem(StorageKeys.CART_ITEMS);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour passer commande',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Panier vide', 'Ajoutez des produits à votre panier avant de passer commande');
      return;
    }

    setLoading(true);
    try {
      // Pour l'instant, on traite un produit à la fois
      // Dans une version future, on pourrait implémenter un checkout multiple
      const firstItem = cartItems[0];
      
      const response = await walletAPI.achatProduit({
        product_id: firstItem.id,
        quantity: firstItem.quantity
      });

      // Retirer l'article du panier après achat réussi
      const remainingItems = cartItems.filter(item => item.id !== firstItem.id);
      setCartItems(remainingItems);
      await storage.setItem(StorageKeys.CART_ITEMS, remainingItems);

      Alert.alert(
        'Commande réussie !',
        `Votre commande pour "${firstItem.nom}" a été passée avec succès`,
        [
          { 
            text: 'Voir mes commandes', 
            onPress: () => navigation.navigate('Profile', { screen: 'MyOrders' })
          },
          { text: 'Continuer', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error('Checkout error:', error);
      const message = error.response?.data?.error || 'Erreur lors de la commande';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  const CartItem = ({ item }) => (
    <View style={[globalStyles.card, { marginBottom: 12 }]}>
      <View style={globalStyles.row}>
        <View style={{ width: 80, height: 80, backgroundColor: colors.border, borderRadius: 8, marginRight: 12 }} />
        
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.text} numberOfLines={2}>{item.nom}</Text>
          <Text style={[globalStyles.textLight, { fontSize: 14 }]}>{item.categorie}</Text>
          
          <View style={[globalStyles.row, { marginTop: 8, alignItems: 'center' }]}>
            <Text style={[globalStyles.subtitle, { color: colors.primary }]}>
              {(item.prix * item.quantity).toLocaleString()} FCFA
            </Text>
            
            <View style={[globalStyles.row, { marginLeft: 'auto', alignItems: 'center' }]}>
              <TouchableOpacity
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.border,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>-</Text>
              </TouchableOpacity>
              
              <Text style={[globalStyles.text, { marginHorizontal: 12, fontSize: 16 }]}>
                {item.quantity}
              </Text>
              
              <TouchableOpacity
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.primary,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>+</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{ marginLeft: 16 }}
                onPress={() => removeFromCart(item.id)}
              >
                <Text style={{ color: colors.error, fontSize: 20 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.prix * item.quantity), 0);

  return (
    <View style={globalStyles.container}>
      <ScrollView
        style={globalStyles.screen}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* En-tête */}
        <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
          <Text style={[globalStyles.title, { color: '#fff' }]}>
            Mon Panier
          </Text>
          <Text style={[globalStyles.textLight, { color: '#fff' }]}>
            {totalItems} article{totalItems !== 1 ? 's' : ''} • {totalPrice.toLocaleString()} FCFA
          </Text>
        </View>

        {cartItems.length > 0 ? (
          <>
            {/* Liste des articles */}
            <View style={{ padding: 16 }}>
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </View>

            {/* Récapitulatif */}
            <View style={globalStyles.card}>
              <Text style={globalStyles.subtitle}>Récapitulatif</Text>
              
              <View style={[globalStyles.spaceBetween, { marginTop: 12 }]}>
                <Text style={globalStyles.textLight}>Sous-total:</Text>
                <Text style={globalStyles.text}>{totalPrice.toLocaleString()} FCFA</Text>
              </View>
              
              <View style={[globalStyles.spaceBetween, { marginTop: 8 }]}>
                <Text style={globalStyles.textLight}>Livraison:</Text>
                <Text style={globalStyles.text}>Gratuite</Text>
              </View>
              
              <View style={[globalStyles.spaceBetween, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }]}>
                <Text style={[globalStyles.text, { fontWeight: '600' }]}>Total:</Text>
                <Text style={[globalStyles.title, { color: colors.primary }]}>
                  {totalPrice.toLocaleString()} FCFA
                </Text>
              </View>
            </View>

            {/* Bouton de commande */}
            <View style={{ padding: 16 }}>
              <TouchableOpacity
                style={[
                  globalStyles.button,
                  { marginBottom: 8 },
                  loading && { opacity: 0.7 }
                ]}
                onPress={handleCheckout}
                disabled={loading}
              >
                <Text style={globalStyles.buttonText}>
                  {loading ? 'Traitement...' : `Commander ${totalPrice.toLocaleString()} FCFA`}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[globalStyles.button, { backgroundColor: colors.error }]}
                onPress={clearCart}
              >
                <Text style={globalStyles.buttonText}>Vider le panier</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* Panier vide */
          <View style={[globalStyles.card, globalStyles.center, { padding: 40 }]}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>🛒</Text>
            <Text style={[globalStyles.subtitle, { textAlign: 'center' }]}>
              Votre panier est vide
            </Text>
            <Text style={[globalStyles.textLight, { textAlign: 'center', marginTop: 8 }]}>
              Parcourez la marketplace et ajoutez des produits à votre panier
            </Text>
            <TouchableOpacity
              style={[globalStyles.button, { marginTop: 24 }]}
              onPress={() => navigation.navigate('Marketplace')}
            >
              <Text style={globalStyles.buttonText}>Découvrir les produits</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CartScreen;