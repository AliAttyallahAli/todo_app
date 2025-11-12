import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import * as LocalAuthentication from 'expo-local-authentication';

const SecurityScreen = ({ navigation }) => {
  const [securitySettings, setSecuritySettings] = useState({
    biometrics: false,
    autoLogout: true,
    sessionTimeout: 30,
    twoFactorAuth: false
  });

  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  React.useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricsAvailable(hasHardware && isEnrolled);
  };

  const handleBiometricsToggle = async (value) => {
    if (value) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authentifiez-vous pour activer la biométrie',
      });

      if (result.success) {
        setSecuritySettings(prev => ({ ...prev, biometrics: true }));
        Alert.alert('Succès', 'Authentification biométrique activée');
      } else {
        setSecuritySettings(prev => ({ ...prev, biometrics: false }));
      }
    } else {
      setSecuritySettings(prev => ({ ...prev, biometrics: false }));
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Changer le mot de passe',
      'Un email de réinitialisation vous sera envoyé',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Envoyer', onPress: () => {/* Send reset email */} }
      ]
    );
  };

  const SecurityItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false,
    switchValue = false,
    onSwitchChange,
    disabled = false
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
          opacity: disabled ? 0.6 : 1,
        }
      ]}
      onPress={onPress}
      disabled={disabled || showSwitch}
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
          disabled={disabled}
        />
      )}

      {!showSwitch && (
        <Text style={{ color: colors.textLight }}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={globalStyles.container}>
      {/* En-tête */}
      <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
        <Text style={[globalStyles.title, { color: '#fff' }]}>
          Sécurité
        </Text>
        <Text style={[globalStyles.textLight, { color: '#fff' }]}>
          Gérez la sécurité de votre compte
        </Text>
      </View>

      {/* Authentification */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Authentification</Text>
        
        <SecurityItem
          icon="👁️"
          title="Authentification biométrique"
          subtitle="Utiliser l'empreinte digitale ou le visage"
          showSwitch
          switchValue={securitySettings.biometrics}
          onSwitchChange={handleBiometricsToggle}
          disabled={!biometricsAvailable}
        />
        
        <SecurityItem
          icon="🔢"
          title="Authentification à deux facteurs"
          subtitle="Sécurité renforcée pour votre compte"
          showSwitch
          switchValue={securitySettings.twoFactorAuth}
          onSwitchChange={(value) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: value }))}
        />
        
        <SecurityItem
          icon="🔑"
          title="Changer le mot de passe"
          subtitle="Mettre à jour votre mot de passe"
          onPress={handleChangePassword}
        />
      </View>

      {/* Session */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Session</Text>
        
        <SecurityItem
          icon="⏰"
          title="Déconnexion automatique"
          subtitle="Se déconnecter après inactivité"
          showSwitch
          switchValue={securitySettings.autoLogout}
          onSwitchChange={(value) => setSecuritySettings(prev => ({ ...prev, autoLogout: value }))}
        />
        
        {securitySettings.autoLogout && (
          <View style={{ marginTop: 12 }}>
            <Text style={globalStyles.text}>Délai de déconnexion</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              {[15, 30, 60].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: securitySettings.sessionTimeout === minutes ? colors.primary : colors.surface,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: securitySettings.sessionTimeout === minutes ? colors.primary : colors.border,
                    marginRight: 8,
                  }}
                  onPress={() => setSecuritySettings(prev => ({ ...prev, sessionTimeout: minutes }))}
                >
                  <Text style={{
                    color: securitySettings.sessionTimeout === minutes ? '#fff' : colors.text,
                    fontSize: 14,
                  }}>
                    {minutes} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Appareils connectés */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Appareils connectés</Text>
        
        <View style={[globalStyles.row, { padding: 16 }]}>
          <Text style={{ fontSize: 20, marginRight: 12 }}>📱</Text>
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.text}>Cet appareil</Text>
            <Text style={[globalStyles.textLight, { fontSize: 12 }]}>
              Connecté maintenant
            </Text>
          </View>
          <Text style={{ color: colors.success, fontSize: 12 }}>Actif</Text>
        </View>
        
        <TouchableOpacity
          style={[globalStyles.button, { backgroundColor: colors.info }]}
          onPress={() => navigation.navigate('ConnectedDevices')}
        >
          <Text style={globalStyles.buttonText}>Gérer les appareils</Text>
        </TouchableOpacity>
      </View>

      {/* Conseils de sécurité */}
      <View style={[globalStyles.card, { backgroundColor: `${colors.warning}10` }]}>
        <Text style={[globalStyles.subtitle, { color: colors.warning }]}>
          🔒 Conseils de sécurité
        </Text>
        <Text style={[globalStyles.textLight, { marginTop: 8 }]}>
          • Utilisez un mot de passe fort{'\n'}
          • Activez l'authentification à deux facteurs{'\n'}
          • Ne partagez jamais vos codes{'\n'}
          • Vérifiez régulièrement votre activité
        </Text>
      </View>

      {/* Activité récente */}
      <TouchableOpacity
        style={globalStyles.card}
        onPress={() => navigation.navigate('SecurityActivity')}
      >
        <View style={globalStyles.spaceBetween}>
          <Text style={globalStyles.subtitle}>Activité récente</Text>
          <Text style={{ color: colors.primary }}>Voir tout ›</Text>
        </View>
        <Text style={[globalStyles.textLight, { textAlign: 'center', marginVertical: 20 }]}>
          Aucune activité suspecte détectée
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SecurityScreen;