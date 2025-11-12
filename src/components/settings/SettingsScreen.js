import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { useAuth } from '../../context/AuthContext';
import { storage, StorageKeys } from '../../services/storage';
import * as Notifications from 'expo-notifications';

const SettingsScreen = ({ navigation }) => {
  const { logout, user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    biometrics: false,
    darkMode: false,
    autoLogin: true,
  });

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Vider le cache',
      'Cette action supprimera toutes les données temporaires. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Vider', 
          style: 'destructive',
          onPress: async () => {
            await storage.removeItem(StorageKeys.RECENT_SEARCHES);
            Alert.alert('Succès', 'Cache vidé avec succès');
          }
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@zoudousouk.td?subject=Support ZouDou-Souk');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://zoudousouk.td/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://zoudousouk.td/terms');
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false,
    switchValue = false,
    onSwitchChange,
    type = 'default'
  }) => (
    <TouchableOpacity
      style={[
        globalStyles.row,
        {
          padding: 16,
          backgroundColor: colors.surface,
          borderRadius: 8,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: colors.border,
        }
      ]}
      onPress={onPress}
      disabled={showSwitch}
    >
      <Text style={{ fontSize: 20, marginRight: 12, width: 24 }}>{icon}</Text>
      
      <View style={{ flex: 1 }}>
        <Text style={globalStyles.text}>{title}</Text>
        {subtitle && (
          <Text style={[globalStyles.textLight, { fontSize: 12, marginTop: 2 }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {showSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary }}
        />
      )}

      {!showSwitch && type !== 'danger' && (
        <Text style={{ color: colors.textLight }}>›</Text>
      )}

      {type === 'danger' && (
        <Text style={{ color: colors.error }}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={globalStyles.container}>
      {/* En-tête */}
      <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
        <Text style={[globalStyles.title, { color: '#fff' }]}>
          Paramètres
        </Text>
        <Text style={[globalStyles.textLight, { color: '#fff' }]}>
          Gérez vos préférences et paramètres
        </Text>
      </View>

      {/* Compte */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Compte</Text>
        
        <SettingItem
          icon="👤"
          title="Informations personnelles"
          subtitle="Modifier votre profil"
          onPress={() => navigation.navigate('EditProfile')}
        />
        
        <SettingItem
          icon="🔐"
          title="Sécurité"
          subtitle="Mot de passe et authentification"
          onPress={() => navigation.navigate('Security')}
        />
        
        <SettingItem
          icon="💳"
          title="Méthodes de paiement"
          subtitle="Gérer vos moyens de paiement"
          onPress={() => navigation.navigate('PaymentMethods')}
        />
      </View>

      {/* Préférences */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Préférences</Text>
        
        <SettingItem
          icon="🔔"
          title="Notifications"
          subtitle="Recevoir des alertes et notifications"
          showSwitch
          switchValue={settings.notifications}
          onSwitchChange={(value) => setSettings(prev => ({ ...prev, notifications: value }))}
        />
        
        <SettingItem
          icon="🌙"
          title="Mode sombre"
          subtitle="Activer l'apparence sombre"
          showSwitch
          switchValue={settings.darkMode}
          onSwitchChange={(value) => setSettings(prev => ({ ...prev, darkMode: value }))}
        />
        
        <SettingItem
          icon="👁️"
          title="Connexion biométrique"
          subtitle="Utiliser l'empreinte digitale ou le visage"
          showSwitch
          switchValue={settings.biometrics}
          onSwitchChange={(value) => setSettings(prev => ({ ...prev, biometrics: value }))}
        />
        
        <SettingItem
          icon="🚀"
          title="Connexion automatique"
          subtitle="Rester connecté entre les sessions"
          showSwitch
          switchValue={settings.autoLogin}
          onSwitchChange={(value) => setSettings(prev => ({ ...prev, autoLogin: value }))}
        />
      </View>

      {/* Application */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Application</Text>
        
        <SettingItem
          icon="🗑️"
          title="Vider le cache"
          subtitle="Supprimer les données temporaires"
          onPress={handleClearCache}
        />
        
        <SettingItem
          icon="📱"
          title="Version de l'application"
          subtitle="1.0.0 (Build 1)"
          onPress={() => Alert.alert('Version', 'ZouDou-Souk Mobile v1.0.0')}
        />
        
        <SettingItem
          icon="🌐"
          title="Langue"
          subtitle="Français"
          onPress={() => navigation.navigate('Language')}
        />
      </View>

      {/* Support */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Support</Text>
        
        <SettingItem
          icon="💬"
          title="Contacter le support"
          subtitle="Obtenir de l'aide"
          onPress={handleContactSupport}
        />
        
        <SettingItem
          icon="📖"
          title="Centre d'aide"
          subtitle="Documentation et FAQ"
          onPress={() => navigation.navigate('HelpCenter')}
        />
        
        <SettingItem
          icon="⭐"
          title="Évaluer l'application"
          subtitle="Donnez votre avis sur le store"
          onPress={() => Linking.openURL('market://details?id=com.zoudousouk.mobile')}
        />
      </View>

      {/* Légale */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Légal</Text>
        
        <SettingItem
          icon="📄"
          title="Politique de confidentialité"
          onPress={handlePrivacyPolicy}
        />
        
        <SettingItem
          icon="📝"
          title="Conditions d'utilisation"
          onPress={handleTermsOfService}
        />
        
        <SettingItem
          icon="⚖️"
          title="Mentions légales"
          onPress={() => navigation.navigate('Legal')}
        />
      </View>

      {/* Actions dangereuses */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Actions</Text>
        
        <SettingItem
          icon="🚪"
          title="Déconnexion"
          type="danger"
          onPress={handleLogout}
        />
        
        <SettingItem
          icon="❌"
          title="Supprimer le compte"
          subtitle="Action irréversible"
          type="danger"
          onPress={() => Alert.alert('Suppression de compte', 'Cette fonctionnalité sera disponible prochainement. Contactez le support pour toute demande de suppression de compte.')}
        />
      </View>

      {/* Informations de version */}
      <View style={[globalStyles.card, globalStyles.center]}>
        <Text style={globalStyles.textLight}>ZouDou-Souk Mobile</Text>
        <Text style={[globalStyles.textLight, { fontSize: 12, marginTop: 4 }]}>
          Version 1.0.0 • Build 1
        </Text>
        <Text style={[globalStyles.textLight, { fontSize: 10, marginTop: 8 }]}>
          © 2024 ZouDou-Souk. Tous droits réservés.
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;