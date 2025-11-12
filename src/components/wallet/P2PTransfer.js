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
import { walletAPI } from '../../services/wallet';
import CustomButton from '../common/CustomButton';

const P2PTransfer = ({ navigation }) => {
  const [transferData, setTransferData] = useState({
    to_phone: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleChange = (field, value) => {
    setTransferData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!transferData.to_phone) {
      Alert.alert('Erreur', 'Veuillez saisir le numéro du destinataire');
      return false;
    }

    if (!transferData.amount || parseFloat(transferData.amount) <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide');
      return false;
    }

    return true;
  };

  const handleTransfer = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await walletAPI.p2pTransfer({
        to_phone: transferData.to_phone,
        amount: parseFloat(transferData.amount)
      });

      Alert.alert(
        'Succès',
        `Transfert de ${transferData.amount} FCFA effectué avec succès!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );

      // Reset form
      setTransferData({
        to_phone: '',
        amount: '',
        description: ''
      });

    } catch (error) {
      console.error('Transfer error:', error);
      Alert.alert('Erreur', error.response?.data?.error || 'Erreur lors du transfert');
    } finally {
      setLoading(false);
    }
  };

  const calculateFees = () => {
    const amount = parseFloat(transferData.amount) || 0;
    const fee = amount * 0.01; // 1% fee
    const netAmount = amount - fee;
    return { amount, fee, netAmount };
  };

  const { amount, fee, netAmount } = calculateFees();

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={globalStyles.screen}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* En-tête */}
        <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
          <Text style={[globalStyles.title, { color: '#fff', textAlign: 'center' }]}>
            📤 Transfert d'argent
          </Text>
          <Text style={[globalStyles.textLight, { color: '#fff', textAlign: 'center' }]}>
            Envoyez de l'argent à un autre utilisateur
          </Text>
        </View>

        {/* Formulaire de transfert */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Informations du transfert</Text>

          {/* Numéro du destinataire */}
          <View style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.text, { marginBottom: 8 }]}>
              Numéro du destinataire *
            </Text>
            <TextInput
              style={globalStyles.input}
              placeholder="+235 XX XX XX XX"
              value={transferData.to_phone}
              onChangeText={(value) => handleChange('to_phone', value)}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          </View>

          {/* Montant */}
          <View style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.text, { marginBottom: 8 }]}>
              Montant (FCFA) *
            </Text>
            <TextInput
              style={globalStyles.input}
              placeholder="0.00"
              value={transferData.amount}
              onChangeText={(value) => handleChange('amount', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Description */}
          <View style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.text, { marginBottom: 8 }]}>
              Description (optionnel)
            </Text>
            <TextInput
              style={[globalStyles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Ajoutez une description pour cette transaction..."
              value={transferData.description}
              onChangeText={(value) => handleChange('description', value)}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Récapitulatif */}
          {transferData.amount && (
            <View style={{
              backgroundColor: `${colors.primary}10`,
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
            }}>
              <Text style={[globalStyles.subtitle, { marginBottom: 12 }]}>
                Récapitulatif
              </Text>
              
              <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
                <Text style={globalStyles.textLight}>Montant à envoyer:</Text>
                <Text style={globalStyles.text}>{amount.toLocaleString()} FCFA</Text>
              </View>
              
              <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
                <Text style={globalStyles.textLight}>Frais (1%):</Text>
                <Text style={[globalStyles.text, { color: colors.error }]}>
                  -{fee.toLocaleString()} FCFA
                </Text>
              </View>
              
              <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
                <Text style={globalStyles.textLight}>Montant reçu:</Text>
                <Text style={[globalStyles.text, { color: colors.success, fontWeight: '600' }]}>
                  {netAmount.toLocaleString()} FCFA
                </Text>
              </View>
              
              <View style={[globalStyles.spaceBetween, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }]}>
                <Text style={[globalStyles.text, { fontWeight: '600' }]}>Total débité:</Text>
                <Text style={[globalStyles.text, { fontWeight: '600' }]}>
                  {amount.toLocaleString()} FCFA
                </Text>
              </View>
            </View>
          )}

          {/* Bouton de transfert */}
          <CustomButton
            title="Effectuer le transfert"
            onPress={handleTransfer}
            loading={loading}
            disabled={!transferData.to_phone || !transferData.amount}
          />
        </View>

        {/* Conseils de sécurité */}
        <View style={[globalStyles.card, { backgroundColor: `${colors.warning}10` }]}>
          <Text style={[globalStyles.subtitle, { color: colors.warning }]}>
            🔒 Conseils de sécurité
          </Text>
          <Text style={[globalStyles.textLight, { marginTop: 8 }]}>
            • Vérifiez le numéro du destinataire{'\n'}
            • Les transferts sont instantanés{'\n'}
            • Les frais de 1% sont non remboursables{'\n'}
            • Contactez le support en cas de problème
          </Text>
        </View>

        {/* Contacts fréquents */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Contacts fréquents</Text>
          <Text style={[globalStyles.textLight, { textAlign: 'center', marginVertical: 20 }]}>
            Fonctionnalité à venir
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default P2PTransfer;