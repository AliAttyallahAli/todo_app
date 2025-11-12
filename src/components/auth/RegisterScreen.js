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
import { PROVINCES_TCHAD } from '../../utils/constants';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nni: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_naissance: '',
    province: '',
    region: '',
    ville: '',
    quartier: ''
  });
  const [loading, setLoading] = useState(false);
  const [showProvincePicker, setShowProvincePicker] = useState(false);

  const { register } = useAuth();

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nni || formData.nni.length !== 8) {
      Alert.alert('Erreur', 'Le NNI doit contenir 8 chiffres');
      return false;
    }

    if (!formData.phone) {
      Alert.alert('Erreur', 'Veuillez saisir votre numéro de téléphone');
      return false;
    }

    if (!formData.email) {
      Alert.alert('Erreur', 'Veuillez saisir votre email');
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    if (!formData.nom || !formData.prenom) {
      Alert.alert('Erreur', 'Veuillez saisir votre nom et prénom');
      return false;
    }

    if (!formData.province) {
      Alert.alert('Erreur', 'Veuillez sélectionner votre province');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      const result = await register(submitData);

      if (result.success) {
        Alert.alert(
          'Inscription réussie',
          'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
          [
            {
              text: 'Se connecter',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        Alert.alert('Erreur', result.error);
      }
    } catch (error) {
      Alert.alert('Erreur', "Une erreur s'est produite lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const FormSection = ({ title, children }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={[globalStyles.subtitle, { marginBottom: 16 }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={globalStyles.screen}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* En-tête */}
        <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
          <Text style={[globalStyles.title, { color: '#fff', textAlign: 'center' }]}>
            Créer un compte
          </Text>
          <Text style={[globalStyles.textLight, { color: '#fff', textAlign: 'center' }]}>
            Rejoignez la communauté ZouDou-Souk
          </Text>
        </View>

        <View style={globalStyles.card}>
          {/* Informations d'identification */}
          <FormSection title="Informations d'identification">
            <View style={{ marginBottom: 12 }}>
              <Text style={globalStyles.text}>NNI *</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="8 chiffres de votre carte d'identité"
                value={formData.nni}
                onChangeText={(value) => handleChange('nni', value)}
                keyboardType="numeric"
                maxLength={8}
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={globalStyles.text}>Téléphone *</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="+235 XX XX XX XX"
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={globalStyles.text}>Email *</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="votre@email.com"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </FormSection>

          {/* Mot de passe */}
          <FormSection title="Mot de passe">
            <View style={{ marginBottom: 12 }}>
              <Text style={globalStyles.text}>Mot de passe *</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Minimum 6 caractères"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={globalStyles.text}>Confirmer le mot de passe *</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Retapez votre mot de passe"
                value={formData.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                secureTextEntry
              />
            </View>
          </FormSection>

          {/* Informations personnelles */}
          <FormSection title="Informations personnelles">
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={globalStyles.text}>Nom *</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChangeText={(value) => handleChange('nom', value)}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={globalStyles.text}>Prénom *</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChangeText={(value) => handleChange('prenom', value)}
                />
              </View>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={globalStyles.text}>Date de naissance</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="JJ/MM/AAAA"
                value={formData.date_naissance}
                onChangeText={(value) => handleChange('date_naissance', value)}
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={globalStyles.text}>Lieu de naissance</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Ville de naissance"
                value={formData.lieu_naissance}
                onChangeText={(value) => handleChange('lieu_naissance', value)}
              />
            </View>
          </FormSection>

          {/* Localisation */}
          <FormSection title="Localisation">
            <View style={{ marginBottom: 12 }}>
              <Text style={globalStyles.text}>Province *</Text>
              <TouchableOpacity
                style={globalStyles.input}
                onPress={() => setShowProvincePicker(true)}
              >
                <Text style={{ color: formData.province ? colors.text : colors.textLight }}>
                  {formData.province || 'Sélectionnez votre province'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={globalStyles.text}>Région</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Votre région"
                value={formData.region}
                onChangeText={(value) => handleChange('region', value)}
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={globalStyles.text}>Ville *</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Votre ville"
                value={formData.ville}
                onChangeText={(value) => handleChange('ville', value)}
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={globalStyles.text}>Quartier</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Votre quartier"
                value={formData.quartier}
                onChangeText={(value) => handleChange('quartier', value)}
              />
            </View>
          </FormSection>

          {/* Bouton d'inscription */}
          <TouchableOpacity
            style={[
              globalStyles.button,
              { marginTop: 16 },
              loading && { opacity: 0.7 }
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </Text>
          </TouchableOpacity>

          {/* Lien vers connexion */}
          <View style={[globalStyles.row, { justifyContent: 'center', marginTop: 20 }]}>
            <Text style={globalStyles.textLight}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[globalStyles.text, { color: colors.primary, fontWeight: '600' }]}>
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sélecteur de province modal */}
        {showProvincePicker && (
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
                Sélectionnez votre province
              </Text>
              <ScrollView>
                {PROVINCES_TCHAD.map((province) => (
                  <TouchableOpacity
                    key={province}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }}
                    onPress={() => {
                      handleChange('province', province);
                      setShowProvincePicker(false);
                    }}
                  >
                    <Text style={globalStyles.text}>{province}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[globalStyles.button, { marginTop: 16, backgroundColor: colors.error }]}
                onPress={() => setShowProvincePicker(false)}
              >
                <Text style={globalStyles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;