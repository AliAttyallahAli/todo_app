import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { userAPI } from '../../services/auth';

const KycForm = ({ navigation }) => {
  const [documents, setDocuments] = useState({
    identity_front: null,
    identity_back: null,
    selfie: null,
    proof_address: null
  });
  const [uploading, setUploading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à votre galerie.');
      return false;
    }
    return true;
  };

  const pickImage = async (documentType) => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setDocuments(prev => ({
        ...prev,
        [documentType]: result.assets[0]
      }));
    }
  };

  const takePhoto = async (documentType) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à votre caméra.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setDocuments(prev => ({
        ...prev,
        [documentType]: result.assets[0]
      }));
    }
  };

  const handleSubmit = async () => {
    // Vérifier que tous les documents sont fournis
    const missingDocs = Object.entries(documents)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingDocs.length > 0) {
      Alert.alert('Documents manquants', 'Veuillez fournir tous les documents requis.');
      return;
    }

    setUploading(true);
    try {
      // Ici, vous enverriez les documents à votre backend
      // Pour l'exemple, on simule l'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Documents soumis',
        'Vos documents ont été soumis avec succès. Notre équipe les vérifiera sous 24-48 heures.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de soumettre les documents');
    } finally {
      setUploading(false);
    }
  };

  const DocumentUpload = ({ title, description, documentType, isRequired = true }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={[globalStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
        {title} {isRequired && '*'}
      </Text>
      <Text style={[globalStyles.textLight, { fontSize: 14, marginBottom: 12 }]}>
        {description}
      </Text>

      {documents[documentType] ? (
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{ uri: documents[documentType].uri }}
            style={{
              width: 200,
              height: 150,
              borderRadius: 8,
              marginBottom: 12,
            }}
          />
          <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: colors.error }]}
            onPress={() => setDocuments(prev => ({ ...prev, [documentType]: null }))}
          >
            <Text style={globalStyles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1, marginRight: 8 }]}
            onPress={() => pickImage(documentType)}
          >
            <Text style={globalStyles.buttonText}>📁 Galerie</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1, marginLeft: 8 }]}
            onPress={() => takePhoto(documentType)}
          >
            <Text style={globalStyles.buttonText}>📷 Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={globalStyles.container}>
      {/* En-tête */}
      <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
        <Text style={[globalStyles.title, { color: '#fff', textAlign: 'center' }]}>
          Vérification KYC
        </Text>
        <Text style={[globalStyles.textLight, { color: '#fff', textAlign: 'center' }]}>
          Complétez votre profil avec vos documents
        </Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={[globalStyles.subtitle, { marginBottom: 16 }]}>
          Documents requis
        </Text>

        <DocumentUpload
          title="Carte d'identité - Recto"
          description="Photo recto de votre carte d'identité ou passeport"
          documentType="identity_front"
        />

        <DocumentUpload
          title="Carte d'identité - Verso"
          description="Photo verso de votre carte d'identité"
          documentType="identity_back"
        />

        <DocumentUpload
          title="Selfie avec pièce d'identité"
          description="Photo de vous tenant votre pièce d'identité"
          documentType="selfie"
        />

        <DocumentUpload
          title="Justificatif de domicile"
          description="Facture d'électricité, eau ou téléphone de moins de 3 mois"
          documentType="proof_address"
        />

        {/* Informations importantes */}
        <View style={{
          backgroundColor: `${colors.warning}10`,
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
        }}>
          <Text style={[globalStyles.subtitle, { color: colors.warning, marginBottom: 8 }]}>
            💡 Informations importantes
          </Text>
          <Text style={globalStyles.textLight}>
            • Tous les documents doivent être lisibles{'\n'}
            • Les photos doivent être nettes et bien éclairées{'\n'}
            • Le traitement prend 24-48 heures{'\n'}
            • Vous serez notifié par email du résultat
          </Text>
        </View>

        {/* Bouton de soumission */}
        <TouchableOpacity
          style={[
            globalStyles.button,
            { marginTop: 16 },
            uploading && { opacity: 0.7 }
          ]}
          onPress={handleSubmit}
          disabled={uploading}
        >
          <Text style={globalStyles.buttonText}>
            {uploading ? 'Soumission...' : 'Soumettre les documents'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confidentialité */}
      <View style={[globalStyles.card, { backgroundColor: `${colors.info}10` }]}>
        <Text style={[globalStyles.subtitle, { color: colors.info }]}>
          🔒 Confidentialité
        </Text>
        <Text style={[globalStyles.textLight, { marginTop: 8 }]}>
          Vos documents sont chiffrés et stockés de manière sécurisée. 
          Ils sont utilisés uniquement pour la vérification de votre identité 
          et ne seront pas partagés avec des tiers.
        </Text>
      </View>
    </ScrollView>
  );
};

export default KycForm;