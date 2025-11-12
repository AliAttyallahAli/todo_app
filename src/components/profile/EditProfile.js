import React, { useState, useEffect } from 'react';
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
import { userAPI } from '../../services/auth';
import { PROVINCES_TCHAD } from '../../utils/constants';

const EditProfile = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showProvincePicker, setShowProvincePicker] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Erreur', 'Impossible de charger le profil');
    }
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!profile.nom || !profile.prenom || !profile.ville) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      await userAPI.updateProfile({
        nom: profile.nom,
        prenom: profile.prenom,
        date_naissance: profile.date_naissance,
        lieu_naissance: profile.lieu_naissance,
        province: profile.province,
        region: profile.region,
        ville: profile.ville,
        quartier: profile.quartier,
        photo: profile.photo
      });

      Alert.alert('Succès', 'Profil mis à jour avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <View style={[globalStyles.container, globalStyles.center]}>
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={globalStyles.screen}>
        {/* En-tête */}
        <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
          <Text style={[globalStyles.title, { color: '#fff', textAlign: 'center' }]}>
            Modifier le profil
          </Text>
        </View>

        <View style={globalStyles.card}>
          {/* Informations personnelles */}
          <Text style={[globalStyles.subtitle, { marginBottom: 16 }]}>
            Informations personnelles
          </Text>

          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={globalStyles.text}>Nom *</Text>
              <TextInput
                style={globalStyles.input}
                value={profile.nom}
                onChangeText={(value) => handleChange('nom', value)}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={globalStyles.text}>Prénom *</Text>
              <TextInput
                style={globalStyles.input}
                value={profile.prenom}
                onChangeText={(value) => handleChange('prenom', value)}
              />
            </View>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={globalStyles.text}>Date de naissance</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="JJ/MM/AAAA"
              value={profile.date_naissance}
              onChangeText={(value) => handleChange('date_naissance', value)}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={globalStyles.text}>Lieu de naissance</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Ville de naissance"
              value={profile.lieu_naissance}
              onChangeText={(value) => handleChange('lieu_naissance', value)}
            />
          </View>

          {/* Localisation */}
          <Text style={[globalStyles.subtitle, { marginBottom: 16, marginTop: 24 }]}>
            Localisation
          </Text>

          <View style={{ marginBottom: 12 }}>
            <Text style={globalStyles.text}>Province</Text>
            <TouchableOpacity
              style={globalStyles.input}
              onPress={() => setShowProvincePicker(true)}
            >
              <Text style={{ color: profile.province ? colors.text : colors.textLight }}>
                {profile.province || 'Sélectionnez votre province'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={globalStyles.text}>Région</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Votre région"
              value={profile.region}
              onChangeText={(value) => handleChange('region', value)}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={globalStyles.text}>Ville *</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Votre ville"
              value={profile.ville}
              onChangeText={(value) => handleChange('ville', value)}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.text}>Quartier</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Votre quartier"
              value={profile.quartier}
              onChangeText={(value) => handleChange('quartier', value)}
            />
          </View>

          {/* Informations non modifiables */}
          <Text style={[globalStyles.subtitle, { marginBottom: 16, marginTop: 24 }]}>
            Informations de compte
          </Text>

          <View style={{ marginBottom: 12 }}>
            <Text style={globalStyles.text}>Email</Text>
            <TextInput
              style={[globalStyles.input, { backgroundColor: colors.border }]}
              value={profile.email}
              editable={false}
            />
            <Text style={[globalStyles.textLight, { fontSize: 12, marginTop: 4 }]}>
              L'email ne peut pas être modifié
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={globalStyles.text}>Téléphone</Text>
            <TextInput
              style={[globalStyles.input, { backgroundColor: colors.border }]}
              value={profile.phone}
              editable={false}
            />
            <Text style={[globalStyles.textLight, { fontSize: 12, marginTop: 4 }]}>
              Le téléphone ne peut pas être modifié
            </Text>
          </View>

          {/* Boutons */}
          <View style={{ flexDirection: 'row', marginTop: 24 }}>
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
                saving && { opacity: 0.7 }
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={globalStyles.buttonText}>
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
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

export default EditProfile;