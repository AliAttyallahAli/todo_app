import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { useAuth } from '../../context/AuthContext';
import { walletAPI } from '../../services/wallet';
import QRCode from 'react-native-qrcode-svg';

const WalletScreen = ({ navigation }) => {
  const [wallet, setWallet] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const response = await walletAPI.getBalance();
      setWallet(response.data);
    } catch (error) {
      console.error('Error loading wallet:', error);
      Alert.alert('Erreur', 'Impossible de charger le portefeuille');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWallet();
    setRefreshing(false);
  };

  const QuickAction = ({ icon, title, onPress, color = colors.primary }) => (
    <TouchableOpacity
      style={[globalStyles.center, { flex: 1, marginHorizontal: 4 }]}
      onPress={onPress}
    >
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: color,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 20 }}>{icon}</Text>
      </View>
      <Text style={[globalStyles.textLight, { fontSize: 12, textAlign: 'center' }]}>
        {title}
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
      {/* Solde */}
      <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
        <Text style={[globalStyles.textLight, { color: '#fff' }]}>Solde disponible</Text>
        <Text style={[globalStyles.title, { color: '#fff', fontSize: 32, marginVertical: 8 }]}>
          {wallet?.balance?.toLocaleString()} FCFA
        </Text>
        <Text style={[globalStyles.textLight, { color: '#fff' }]}>
          Numéro wallet: {wallet?.phone}
        </Text>
      </View>

      {/* Actions rapides */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Actions Rapides</Text>
        <View style={[globalStyles.row, { marginTop: 16 }]}>
          <QuickAction
            icon="📤"
            title="Envoyer"
            onPress={() => navigation.navigate('P2PTransfer')}
            color={colors.secondary}
          />
          <QuickAction
            icon="📥"
            title="Recevoir"
            onPress={() => Alert.alert('QR Code', 'Votre QR code pour recevoir des paiements')}
            color={colors.success}
          />
          <QuickAction
            icon="⚡"
            title="Factures"
            onPress={() => navigation.navigate('Services')}
            color={colors.ziz}
          />
          <QuickAction
            icon="📊"
            title="Historique"
            onPress={() => {/* Navigate to history */}}
            color={colors.info}
          />
        </View>
      </View>

      {/* QR Code */}
      {wallet?.phone && (
        <View style={[globalStyles.card, globalStyles.center]}>
          <Text style={globalStyles.subtitle}>Votre QR Code</Text>
          <Text style={[globalStyles.textLight, { textAlign: 'center', marginBottom: 16 }]}>
            Partagez ce code pour recevoir des paiements
          </Text>
          
          <QRCode
            value={`zoudousouk:${wallet.phone}`}
            size={200}
            backgroundColor={colors.surface}
            color={colors.primary}
          />
          
          <Text style={[globalStyles.text, { marginTop: 16, fontWeight: '600' }]}>
            {wallet.phone}
          </Text>
          
          <TouchableOpacity
            style={[globalStyles.button, { marginTop: 16 }]}
            onPress={() => Alert.alert('Partager', 'Fonctionnalité de partage à implémenter')}
          >
            <Text style={globalStyles.buttonText}>Partager QR Code</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Services */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Services de Paiement</Text>
        
        <TouchableOpacity
          style={[globalStyles.row, { padding: 16, backgroundColor: `${colors.ziz}20`, borderRadius: 8, marginTop: 12 }]}
          onPress={() => navigation.navigate('Services')}
        >
          <Text style={{ fontSize: 24, marginRight: 12 }}>⚡</Text>
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.text}>ZIZ - Électricité</Text>
            <Text style={globalStyles.textLight}>Payer votre facture d'électricité</Text>
          </View>
          <Text style={{ color: colors.primary }}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.row, { padding: 16, backgroundColor: `${colors.ste}20`, borderRadius: 8, marginTop: 8 }]}
          onPress={() => navigation.navigate('Services')}
        >
          <Text style={{ fontSize: 24, marginRight: 12 }}>💧</Text>
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.text}>STE - Eau</Text>
            <Text style={globalStyles.textLight}>Payer votre facture d'eau</Text>
          </View>
          <Text style={{ color: colors.primary }}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.row, { padding: 16, backgroundColor: `${colors.tax}20`, borderRadius: 8, marginTop: 8 }]}
          onPress={() => navigation.navigate('Services')}
        >
          <Text style={{ fontSize: 24, marginRight: 12 }}>🏛️</Text>
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.text}>Taxes Communales</Text>
            <Text style={globalStyles.textLight}>Payer vos taxes</Text>
          </View>
          <Text style={{ color: colors.primary }}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Informations de sécurité */}
      <View style={[globalStyles.card, { backgroundColor: `${colors.info}10` }]}>
        <Text style={[globalStyles.subtitle, { color: colors.info }]}>
          🔒 Sécurisé
        </Text>
        <Text style={[globalStyles.textLight, { marginTop: 8 }]}>
          • Transactions chiffrées{'\n'}
          • Vérification en 2 étapes{'\n'}
          • Support 24/7{'\n'}
          • Frais de transaction: 1%
        </Text>
      </View>
    </ScrollView>
  );
};

export default WalletScreen;