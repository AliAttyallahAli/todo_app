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
import { walletAPI } from '../../services/wallet';
import CustomButton from '../common/CustomButton';

const ServicePayment = ({ route, navigation }) => {
  const { service } = route.params;
  const [paymentData, setPaymentData] = useState({
    reference: '',
    amount: '',
    customer_name: '',
    customer_phone: ''
  });
  const [loading, setLoading] = useState(false);

  const getServiceConfig = () => {
    switch (service.type) {
      case 'ZIZ':
        return { icon: '⚡', color: colors.ziz, name: 'ZIZ - Électricité' };
      case 'STE':
        return { icon: '💧', color: colors.ste, name: 'STE - Eau' };
      case 'TAXE':
        return { icon: '🏛️', color: colors.tax, name: 'TAXE - Taxes communales' };
      default:
        return { icon: '🏢', color: colors.primary, name: service.nom };
    }
  };

  const serviceConfig = getServiceConfig();

  const handleChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!paymentData.reference) {
      Alert.alert('Erreur', 'Veuillez saisir votre numéro de référence');
      return false;
    }

    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide');
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await walletAPI.payerFacture({
        service_type: service.type,
        service_id: service.id,
        amount: parseFloat(paymentData.amount),
        reference: paymentData.reference
      });

      Alert.alert(
        'Paiement Réussi',
        `Votre paiement de ${paymentData.amount} FCFA a été effectué avec succès!`,
        [
          {
            text: 'Voir le reçu',
            onPress: () => {/* Navigate to receipt */}
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );

      // Reset form
      setPaymentData({
        reference: '',
        amount: '',
        customer_name: '',
        customer_phone: ''
      });

    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Erreur', error.response?.data?.error || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const amount = parseFloat(paymentData.amount) || 0;
    const fee = amount * 0.01; // 1% fee
    const total = amount + fee;
    return { amount, fee, total };
  };

  const { amount, fee, total } = calculateTotal();

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={globalStyles.screen}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* En-tête du service */}
        <View style={[globalStyles.card, { backgroundColor: serviceConfig.color }]}>
          <View style={[globalStyles.row, { justifyContent: 'center' }]}>
            <Text style={{ fontSize: 32, marginRight: 12 }}>{serviceConfig.icon}</Text>
            <View>
              <Text style={[globalStyles.title, { color: '#fff' }]}>
                {serviceConfig.name}
              </Text>
              <Text style={[globalStyles.textLight, { color: '#fff' }]}>
                Paiement de facture
              </Text>
            </View>
          </View>
        </View>

        {/* Formulaire de paiement */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Informations de paiement</Text>

          {/* Numéro de référence */}
          <View style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.text, { marginBottom: 8 }]}>
              Numéro de référence *
            </Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Votre numéro de client"
              value={paymentData.reference}
              onChangeText={(value) => handleChange('reference', value)}
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
              value={paymentData.amount}
              onChangeText={(value) => handleChange('amount', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Nom du client */}
          <View style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.text, { marginBottom: 8 }]}>
              Nom du client (optionnel)
            </Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Nom du titulaire de la facture"
              value={paymentData.customer_name}
              onChangeText={(value) => handleChange('customer_name', value)}
            />
          </View>

          {/* Téléphone du client */}
          <View style={{ marginBottom: 16 }}>
            <Text style={[globalStyles.text, { marginBottom: 8 }]}>
              Téléphone (optionnel)
            </Text>
            <TextInput
              style={globalStyles.input}
              placeholder="+235 XX XX XX XX"
              value={paymentData.customer_phone}
              onChangeText={(value) => handleChange('customer_phone', value)}
              keyboardType="phone-pad"
            />
          </View>

          {/* Récapitulatif */}
          {paymentData.amount && (
            <View style={{
              backgroundColor: `${serviceConfig.color}10`,
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
            }}>
              <Text style={[globalStyles.subtitle, { marginBottom: 12 }]}>
                Récapitulatif du paiement
              </Text>
              
              <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
                <Text style={globalStyles.textLight}>Service:</Text>
                <Text style={globalStyles.text}>{serviceConfig.name}</Text>
              </View>
              
              <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
                <Text style={globalStyles.textLight}>Montant facture:</Text>
                <Text style={globalStyles.text}>{amount.toLocaleString()} FCFA</Text>
              </View>
              
              <View style={[globalStyles.spaceBetween, { marginBottom: 8 }]}>
                <Text style={globalStyles.textLight}>Frais de service (1%):</Text>
                <Text style={[globalStyles.text, { color: colors.error }]}>
                  +{fee.toLocaleString()} FCFA
                </Text>
              </View>
              
              <View style={[globalStyles.spaceBetween, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }]}>
                <Text style={[globalStyles.text, { fontWeight: '600' }]}>Total à payer:</Text>
                <Text style={[globalStyles.text, { fontWeight: '600', color: serviceConfig.color }]}>
                  {total.toLocaleString()} FCFA
                </Text>
              </View>
            </View>
          )}

          {/* Bouton de paiement */}
          <CustomButton
            title={`Payer ${total.toLocaleString()} FCFA`}
            onPress={handlePayment}
            loading={loading}
            disabled={!paymentData.reference || !paymentData.amount}
            style={{ backgroundColor: serviceConfig.color }}
          />
        </View>

        {/* Informations importantes */}
        <View style={[globalStyles.card, { backgroundColor: `${colors.warning}10` }]}>
          <Text style={[globalStyles.subtitle, { color: colors.warning }]}>
            💡 Informations importantes
          </Text>
          <Text style={[globalStyles.textLight, { marginTop: 8 }]}>
            • Vérifiez votre numéro de référence{'\n'}
            • Le paiement est instantané{'\n'}
            • Conservez le numéro de transaction{'\n'}
            • Contactez le support en cas de problème
          </Text>
        </View>

        {/* Historique des paiements */}
        <TouchableOpacity
          style={globalStyles.card}
          onPress={() => {/* Navigate to payment history */}}
        >
          <View style={globalStyles.spaceBetween}>
            <Text style={globalStyles.subtitle}>Historique des paiements</Text>
            <Text style={{ color: colors.primary }}>Voir tout →</Text>
          </View>
          <Text style={[globalStyles.textLight, { textAlign: 'center', marginVertical: 20 }]}>
            Aucun paiement récent
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ServicePayment;