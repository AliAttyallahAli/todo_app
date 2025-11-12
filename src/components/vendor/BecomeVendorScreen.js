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
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/auth';

const BecomeVendorScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    entreprise_nom: '',
    entreprise_description: '',
    entreprise_type: '',
    experience_annees: '',
    specialisations: '',
    website: '',
    facebook: '',
    instagram: ''
  });
  const [loading, setLoading] = useState(false);
  const { upgradeToVendeur } = useAuth();

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.entreprise_nom) {
      Alert.alert('Erreur', 'Veuillez saisir le nom de votre entreprise/boutique');
      return false;
    }

    if (!formData.entreprise_description) {
      Alert.alert('Erreur', 'Veuillez décrire vos activités');
      return false;
    }

    if (!formData.entreprise_type) {
      Alert.alert('Erreur', 'Veuillez sélectionner le type d\'entreprise');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await upgradeToVendeur(formData);
      
      if (result.success) {
        Alert.alert(
          'Félicitations !',
          'Votre demande a été envoyée avec succès. Notre équipe la traitera sous 24-48 heures.',
          [
            {
              text: 'Compris',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Erreur', result.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  const entrepriseTypes = [
    'Artisanat',
    'Agriculture',
    'Commerce',
    'Services',
    'Restauration',
    'Textile',
    'Électronique',
    'Autre'
  ];

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={globalStyles.screen}>
        {/* En-tête */}
        <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
          <Text style={[globalStyles.title, { color: '#fff', textAlign: 'center' }]}>
            Devenir Vendeur
          </Text>
          <Text style={[globalStyles.textLight, { color: '#fff', textAlign: 'center' }]}>
            Rejoignez notre communauté de vendeurs
          </Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={[globalStyles.subtitle, { marginBottom: 16 }]}>
            Informations de votre entreprise
          </Text>

          {/* Nom de l'entreprise */}
          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.text}>Nom de l'entreprise/boutique *</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Ex: Ma Boutique Tchad"
              value={formData.entreprise_nom}
              onChangeText={(value) => handleChange('entreprise_nom', value)}
            />
          </View>

          {/* Description */}
          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.text}>Description des activités *</Text>
            <TextInput
              style={[globalStyles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Décrivez vos produits/services en détail..."
              value={formData.entreprise_description}
              onChangeText={(value) => handleChange('entreprise_description', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Type d'entreprise */}
          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.text}>Type d'entreprise *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {entrepriseTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: formData.entreprise_type === type ? colors.primary : colors.surface,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: formData.entreprise_type === type ? colors.primary : colors.border,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                  onPress={() => handleChange('entreprise_type', type)}
                >
                  <Text style={{
                    color: formData.entreprise_type === type ? '#fff' : colors.text,
                    fontSize: 14,
                  }}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Expérience */}
          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.text}>Années d'expérience</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Nombre d'années"
              value={formData.experience_annees}
              onChangeText={(value) => handleChange('experience_annees', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Spécialisations */}
          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.text}>Spécialisations</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Ex: Artisanat local, Produits agricoles..."
              value={formData.specialisations}
              onChangeText={(value) => handleChange('specialisations', value)}
            />
          </View>

          {/* Liens */}
          <Text style={[globalStyles.subtitle, { marginBottom: 16 }]}>
            Liens (optionnels)
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.text}>Site web</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="https://votre-site.td"
              value={formData.website}
              onChangeText={(value) => handleChange('website', value)}
              autoCapitalize="none"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.text}>Facebook</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="https://facebook.com/votre-page"
              value={formData.facebook}
              onChangeText={(value) => handleChange('facebook', value)}
              autoCapitalize="none"
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={globalStyles.text}>Instagram</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="https://instagram.com/votre-compte"
              value={formData.instagram}
              onChangeText={(value) => handleChange('instagram', value)}
              autoCapitalize="none"
            />
          </View>

          {/* Avantages */}
          <View style={{
            backgroundColor: `${colors.success}10`,
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
          }}>
            <Text style={[globalStyles.subtitle, { color: colors.success, marginBottom: 8 }]}>
              🎯 Avantages de devenir vendeur
            </Text>
            <Text style={globalStyles.textLight}>
              • Atteignez des milliers de clients{'\n'}
              • Paiements sécurisés via mobile money{'\n'}
              • Gestion simplifiée de votre boutique{'\n'}
              • Support dédié aux vendeurs{'\n'}
              • Statistiques détaillées de vos ventes
            </Text>
          </View>

          {/* Bouton de soumission */}
          <TouchableOpacity
            style={[
              globalStyles.button,
              loading && { opacity: 0.7 }
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {loading ? 'Traitement...' : 'Soumettre ma demande'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Informations importantes */}
        <View style={[globalStyles.card, { backgroundColor: `${colors.info}10` }]}>
          <Text style={[globalStyles.subtitle, { color: colors.info }]}>
            💡 Informations importantes
          </Text>
          <Text style={[globalStyles.textLight, { marginTop: 8 }]}>
            • Votre demande sera traitée sous 24-48 heures{'\n'}
            • Vous recevrez une notification par email{'\n'}
            • Des frais d'abonnement peuvent s'appliquer{'\n'}
            • Respectez nos conditions d'utilisation
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BecomeVendorScreen;