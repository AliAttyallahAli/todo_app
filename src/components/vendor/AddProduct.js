import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { productsAPI } from '../../services/products';
import { PRODUCT_CATEGORIES, PRODUCT_ETATS } from '../../utils/constants';

const AddProduct = ({ navigation }) => {
  const [productData, setProductData] = useState({
    nom: '',
    description: '',
    prix: '',
    reduction: '',
    etat: 'neuf',
    categorie: '',
    livrable: false,
    adresse_livraison: '',
    quantite: '1',
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);

  const handleChange = (field, value) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à votre galerie.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.slice(0, 5 - productData.photos.length);
      setProductData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const removePhoto = (index) => {
    setProductData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!productData.nom) {
      Alert.alert('Erreur', 'Veuillez saisir le nom du produit');
      return false;
    }

    if (!productData.prix || parseFloat(productData.prix) <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un prix valide');
      return false;
    }

    if (!productData.categorie) {
      Alert.alert('Erreur', 'Veuillez sélectionner une catégorie');
      return false;
    }

    if (productData.photos.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter au moins une photo');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await productsAPI.create(productData);
      
      Alert.alert(
        'Produit ajouté',
        'Votre produit a été publié avec succès!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le produit');
    } finally {
      setLoading(false);
    }
  };

  const PickerModal = ({ visible, title, items, onSelect, onClose }) => {
    if (!visible) return null;

    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 20,
          width: '90%',
          maxHeight: '80%',
        }}>
          <Text style={[globalStyles.subtitle, { marginBottom: 16 }]}>
            {title}
          </Text>
          <ScrollView>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value || item}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
                onPress={() => onSelect(item.value || item)}
              >
                <Text style={globalStyles.text}>{item.label || item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[globalStyles.button, { marginTop: 16, backgroundColor: colors.error }]}
            onPress={onClose}
          >
            <Text style={globalStyles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={globalStyles.screen}>
        {/* En-tête */}
        <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
          <Text style={[globalStyles.title, { color: '#fff', textAlign: 'center' }]}>
            Ajouter un produit
          </Text>
        </View>

        <View style={globalStyles.card}>
          {/* Informations de base */}
          <Text style={[globalStyles.subtitle, { marginBottom: 16 }]}>
            Informations de base
          </Text>

          <View style={{ marginBottom: 12 }}>
            <Text style={globalStyles.text}>Nom du produit *</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Nom descriptif du produit"
              value={productData.nom}
              onChangeText={(value) => handleChange('nom', value)}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={globalStyles.text}>Description</Text>
            <TextInput
              style={[globalStyles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Décrivez votre produit en détail..."
              value={productData.description}
              onChangeText={(value) => handleChange('description', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Prix et état */}
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={globalStyles.text}>Prix (FCFA) *</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="0.00"
                value={productData.prix}
                onChangeText={(value) => handleChange('prix', value)}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={globalStyles.text}>Réduction (%)</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="0"
                value={productData.reduction}
                onChangeText={(value) => handleChange('reduction', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={globalStyles.text}>Catégorie *</Text>
              <TouchableOpacity
                style={globalStyles.input}
                onPress={() => setShowCategoryPicker(true)}
              >
                <Text style={{ color: productData.categorie ? colors.text : colors.textLight }}>
                  {productData.categorie || 'Sélectionnez une catégorie'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={globalStyles.text}>État</Text>
              <TouchableOpacity
                style={globalStyles.input}
                onPress={() => setShowStatePicker(true)}
              >
                <Text style={{ color: colors.text }}>
                  {PRODUCT_ETATS.find(e => e.value === productData.etat)?.label || 'Neuf'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quantité */}
          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.text}>Quantité en stock</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="1"
              value={productData.quantite}
              onChangeText={(value) => handleChange('quantite', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Livraison */}
          <View style={[globalStyles.spaceBetween, { marginBottom: 16 }]}>
            <Text style={globalStyles.text}>Propose la livraison</Text>
            <Switch
              value={productData.livrable}
              onValueChange={(value) => handleChange('livrable', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          {productData.livrable && (
            <View style={{ marginBottom: 16 }}>
              <Text style={globalStyles.text}>Adresse de livraison</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Adresse pour la livraison"
                value={productData.adresse_livraison}
                onChangeText={(value) => handleChange('adresse_livraison', value)}
              />
            </View>
          )}

          {/* Photos */}
          <View style={{ marginBottom: 24 }}>
            <Text style={globalStyles.text}>
              Photos ({productData.photos.length}/5) *
            </Text>
            <Text style={[globalStyles.textLight, { fontSize: 12, marginBottom: 8 }]}>
              Ajoutez jusqu'à 5 photos de votre produit
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {productData.photos.map((photo, index) => (
                <View key={index} style={{ marginRight: 8, position: 'relative' }}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={{ width: 100, height: 100, borderRadius: 8 }}
                  />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      backgroundColor: colors.error,
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={{ color: '#fff', fontSize: 12 }}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {productData.photos.length < 5 && (
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 100,
                    borderWidth: 2,
                    borderColor: colors.border,
                    borderStyle: 'dashed',
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={pickImages}
                >
                  <Text style={{ fontSize: 24, color: colors.textLight }}>+</Text>
                  <Text style={[globalStyles.textLight, { fontSize: 12 }]}>
                    Ajouter
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Boutons */}
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={[
                globalStyles.button,
                { flex: 1, marginRight: 8, backgroundColor: colors.error }
              ]}
              onPress={() => navigation.goBack()}
            >
              <Text style={globalStyles.buttonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.button,
                { flex: 1, marginLeft: 8 },
                loading && { opacity: 0.7 }
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={globalStyles.buttonText}>
                {loading ? 'Publication...' : 'Publier'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modaux */}
        <PickerModal
          visible={showCategoryPicker}
          title="Sélectionnez une catégorie"
          items={PRODUCT_CATEGORIES}
          onSelect={(value) => {
            handleChange('categorie', value);
            setShowCategoryPicker(false);
          }}
          onClose={() => setShowCategoryPicker(false)}
        />

        <PickerModal
          visible={showStatePicker}
          title="Sélectionnez l'état"
          items={PRODUCT_ETATS}
          onSelect={(value) => {
            handleChange('etat', value);
            setShowStatePicker(false);
          }}
          onClose={() => setShowStatePicker(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddProduct;