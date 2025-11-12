import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { useAuth } from '../../context/AuthContext';
import { productsAPI } from '../../services/products';
import { walletAPI } from '../../services/wallet';

const { width } = Dimensions.get('window');

const ProductDetail = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await productsAPI.getById(productId);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Erreur', 'Impossible de charger le produit');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour acheter ce produit',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    setPurchasing(true);
    try {
      const response = await walletAPI.achatProduit({
        product_id: productId,
        quantity: quantity
      });

      Alert.alert(
        'Achat réussi !',
        `Vous avez acheté "${product.nom}" pour ${(product.prix * quantity).toLocaleString()} FCFA`,
        [
          { 
            text: 'Voir mes commandes', 
            onPress: () => navigation.navigate('Profile', { screen: 'MyOrders' })
          },
          { text: 'Continuer', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error('Purchase error:', error);
      const message = error.response?.data?.error || 'Erreur lors de l\'achat';
      Alert.alert('Erreur', message);
    } finally {
      setPurchasing(false);
    }
  };

  const getEtatText = (etat) => {
    switch (etat) {
      case 'neuf': return 'Neuf';
      case 'occasion': return 'Occasion';
      case 'sur_commande': return 'Sur commande';
      default: return etat;
    }
  };

  const getEtatColor = (etat) => {
    switch (etat) {
      case 'neuf': return colors.success;
      case 'occasion': return colors.warning;
      case 'sur_commande': return colors.info;
      default: return colors.textLight;
    }
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, globalStyles.center]}>
        <Text>Chargement du produit...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[globalStyles.container, globalStyles.center]}>
        <Text>Produit non trouvé</Text>
      </View>
    );
  }

  const totalPrice = product.prix * quantity;
  const reductionAmount = product.reduction ? (totalPrice * product.reduction / 100) : 0;
  const finalPrice = totalPrice - reductionAmount;

  return (
    <ScrollView style={globalStyles.container}>
      {/* Images du produit */}
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        style={{ height: 300 }}
      >
        {product.photos && product.photos.length > 0 ? (
          product.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={{ width, height: 300 }}
              resizeMode="cover"
            />
          ))
        ) : (
          <View style={{ width, height: 300, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={globalStyles.textLight}>Aucune image</Text>
          </View>
        )}
      </ScrollView>

      <View style={globalStyles.screen}>
        {/* En-tête du produit */}
        <View style={[globalStyles.card, { marginTop: -50, marginBottom: 0 }]}>
          <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
            <Text style={[globalStyles.title, { flex: 1 }]}>{product.nom}</Text>
            <View style={{
              backgroundColor: `${getEtatColor(product.etat)}20`,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{ color: getEtatColor(product.etat), fontSize: 12, fontWeight: '600' }}>
                {getEtatText(product.etat)}
              </Text>
            </View>
          </View>

          {/* Prix */}
          <View style={[globalStyles.row, { alignItems: 'flex-end', marginBottom: 8 }]}>
            <Text style={[globalStyles.title, { color: colors.primary }]}>
              {finalPrice.toLocaleString()} FCFA
            </Text>
            {product.reduction > 0 && (
              <Text style={[globalStyles.textLight, { textDecorationLine: 'line-through', marginLeft: 8 }]}>
                {totalPrice.toLocaleString()} FCFA
              </Text>
            )}
            {product.reduction > 0 && (
              <View style={{
                backgroundColor: colors.error,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 8,
                marginLeft: 8,
              }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                  -{product.reduction}%
                </Text>
              </View>
            )}
          </View>

          {/* Catégorie et vendeur */}
          <View style={[globalStyles.spaceBetween]}>
            <Text style={globalStyles.textLight}>{product.categorie}</Text>
            <Text style={globalStyles.textLight}>
              Par {product.vendeur_prenom} {product.vendeur_nom}
            </Text>
          </View>
        </View>

        {/* Description */}
        {product.description && (
          <View style={globalStyles.card}>
            <Text style={globalStyles.subtitle}>Description</Text>
            <Text style={[globalStyles.text, { marginTop: 8, lineHeight: 20 }]}>
              {product.description}
            </Text>
          </View>
        )}

        {/* Informations de livraison */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Livraison</Text>
          <View style={[globalStyles.row, { marginTop: 8 }]}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>
              {product.livrable ? '🚚' : '🏪'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.text}>
                {product.livrable ? 'Livraison disponible' : 'Retrait chez le vendeur'}
              </Text>
              {product.livrable && product.adresse_livraison && (
                <Text style={[globalStyles.textLight, { fontSize: 14, marginTop: 4 }]}>
                  {product.adresse_livraison}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Quantité et achat */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Acheter ce produit</Text>
          
          {/* Sélecteur de quantité */}
          <View style={[globalStyles.spaceBetween, { marginVertical: 16 }]}>
            <Text style={globalStyles.text}>Quantité</Text>
            <View style={[globalStyles.row, { alignItems: 'center' }]}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.border,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
              </TouchableOpacity>
              
              <Text style={[globalStyles.text, { marginHorizontal: 16, fontSize: 18 }]}>
                {quantity}
              </Text>
              
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.primary,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Récapitulatif du prix */}
          <View style={{
            backgroundColor: `${colors.primary}10`,
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
          }}>
            <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
              <Text style={globalStyles.textLight}>Prix unitaire:</Text>
              <Text style={globalStyles.text}>{product.prix.toLocaleString()} FCFA</Text>
            </View>
            <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
              <Text style={globalStyles.textLight}>Quantité:</Text>
              <Text style={globalStyles.text}>{quantity}</Text>
            </View>
            {product.reduction > 0 && (
              <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
                <Text style={globalStyles.textLight}>Réduction:</Text>
                <Text style={[globalStyles.text, { color: colors.success }]}>
                  -{reductionAmount.toLocaleString()} FCFA
                </Text>
              </View>
            )}
            <View style={[globalStyles.spaceBetween, { paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }]}>
              <Text style={[globalStyles.text, { fontWeight: '600' }]}>Total:</Text>
              <Text style={[globalStyles.title, { color: colors.primary }]}>
                {finalPrice.toLocaleString()} FCFA
              </Text>
            </View>
          </View>

          {/* Bouton d'achat */}
          <TouchableOpacity
            style={[
              globalStyles.button,
              { marginBottom: 8 },
              purchasing && { opacity: 0.7 }
            ]}
            onPress={handlePurchase}
            disabled={purchasing}
          >
            <Text style={globalStyles.buttonText}>
              {purchasing ? 'Achat en cours...' : `Acheter ${finalPrice.toLocaleString()} FCFA`}
            </Text>
          </TouchableOpacity>

          {!isAuthenticated && (
            <Text style={[globalStyles.textLight, { textAlign: 'center', fontSize: 12, marginTop: 8 }]}>
              * Connectez-vous pour acheter ce produit
            </Text>
          )}
        </View>

        {/* Contact du vendeur */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Contact du vendeur</Text>
          <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: colors.info, marginTop: 12 }]}
            onPress={() => {/* Ouvrir le chat */}}
          >
            <Text style={globalStyles.buttonText}>📞 Contacter le vendeur</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetail;