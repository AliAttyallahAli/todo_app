import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/auth';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

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

  const ProfileItem = ({ icon, title, value, onPress, color = colors.text }) => (
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
      disabled={!onPress}
    >
      <Text style={{ fontSize: 20, marginRight: 12, width: 24 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[globalStyles.text, { fontWeight: '600' }]}>{title}</Text>
        {value && (
          <Text style={[globalStyles.textLight, { fontSize: 14, marginTop: 2 }]}>
            {value}
          </Text>
        )}
      </View>
      {onPress && <Text style={{ color: colors.primary, fontSize: 18 }}>›</Text>}
    </TouchableOpacity>
  );

  const getRoleBadge = (role) => {
    const roles = {
      admin: { text: 'Administrateur', color: colors.warning },
      vendeur: { text: 'Vendeur', color: colors.success },
      client: { text: 'Client', color: colors.primary }
    };
    return roles[role] || { text: role, color: colors.textLight };
  };

  const roleConfig = getRoleBadge(user?.role);

  if (!profile) {
    return (
      <View style={[globalStyles.container, globalStyles.center]}>
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* En-tête du profil */}
      <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
        <View style={[globalStyles.row, { alignItems: 'center' }]}>
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: '#fff',
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            {profile.photo ? (
              <Image
                source={{ uri: profile.photo }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
            ) : (
              <Text style={{ fontSize: 32, color: colors.primary }}>👤</Text>
            )}
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={[globalStyles.title, { color: '#fff' }]}>
              {profile.prenom} {profile.nom}
            </Text>
            <View
              style={{
                backgroundColor: roleConfig.color,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                alignSelf: 'flex-start',
                marginTop: 4,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                {roleConfig.text}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={[globalStyles.textLight, { color: '#fff', marginTop: 8 }]}>
          {profile.email}
        </Text>
        <Text style={[globalStyles.textLight, { color: '#fff' }]}>
          {profile.phone}
        </Text>
      </View>

      {/* Actions du profil */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Mon Compte</Text>
        
        <ProfileItem
          icon="👤"
          title="Informations personnelles"
          value="Modifier votre profil"
          onPress={() => navigation.navigate('EditProfile')}
        />
        
        <ProfileItem
          icon="💳"
          title="Portefeuille"
          value={`Solde: ${profile.wallet?.balance?.toLocaleString() || '0'} FCFA`}
          onPress={() => navigation.navigate('Portefeuille')}
        />
        
        <ProfileItem
          icon="🛍️"
          title="Mes achats"
          value="Historique des commandes"
          onPress={() => navigation.navigate('OrderHistory')}
        />
        
        <ProfileItem
          icon="📊"
          title="Mes statistiques"
          value="Vue d'ensemble de votre activité"
          onPress={() => navigation.navigate('Statistics')}
        />
      </View>

      {/* Vérification */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Vérification</Text>
        
        <ProfileItem
          icon={profile.kyc_verified ? "✅" : "⏳"}
          title="Vérification KYC"
          value={profile.kyc_verified ? "Vérifié" : "En attente"}
          onPress={profile.kyc_verified ? null : () => navigation.navigate('KYC')}
          color={profile.kyc_verified ? colors.success : colors.warning}
        />
        
        {user?.role === 'vendeur' && (
          <ProfileItem
            icon={profile.kyb_verified ? "✅" : "⏳"}
            title="Vérification KYB"
            value={profile.kyb_verified ? "Vérifié" : "En attente"}
            onPress={profile.kyb_verified ? null : () => navigation.navigate('KYB')}
            color={profile.kyb_verified ? colors.success : colors.warning}
          />
        )}
      </View>

      {/* Devenir vendeur */}
      {user?.role === 'client' && (
        <TouchableOpacity
          style={[
            globalStyles.card,
            { 
              backgroundColor: `${colors.primary}10`,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary
            }
          ]}
          onPress={() => navigation.navigate('BecomeVendor')}
        >
          <View style={globalStyles.row}>
            <Text style={{ fontSize: 24, marginRight: 12 }}>🏪</Text>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.subtitle}>Devenir Vendeur</Text>
              <Text style={globalStyles.textLight}>
                Vendez vos produits sur ZouDou-Souk et atteignez plus de clients
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[globalStyles.button, { marginTop: 12, alignSelf: 'flex-start' }]}
            onPress={() => navigation.navigate('BecomeVendor')}
          >
            <Text style={globalStyles.buttonText}>Commencer</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Paramètres */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Paramètres</Text>
        
        <ProfileItem
          icon="🔔"
          title="Notifications"
          value="Gérer les alertes"
          onPress={() => navigation.navigate('Notifications')}
        />
        
        <ProfileItem
          icon="🔒"
          title="Sécurité"
          value="Mot de passe et authentification"
          onPress={() => navigation.navigate('Security')}
        />
        
        <ProfileItem
          icon="🌐"
          title="Langue"
          value="Français"
          onPress={() => navigation.navigate('Language')}
        />
        
        <ProfileItem
          icon="⚙️"
          title="Paramètres de l'application"
          value="Préférences et configurations"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      {/* Support */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Support</Text>
        
        <ProfileItem
          icon="💬"
          title="Centre d'aide"
          value="FAQ et documentation"
          onPress={() => navigation.navigate('HelpCenter')}
        />
        
        <ProfileItem
          icon="📞"
          title="Contacter le support"
          value="Assistance 24/7"
          onPress={() => navigation.navigate('ContactSupport')}
        />
        
        <ProfileItem
          icon="📝"
          title="Signaler un problème"
          value="Bug ou suggestion"
          onPress={() => navigation.navigate('ReportIssue')}
        />
      </View>

      {/* Déconnexion */}
      <TouchableOpacity
        style={[
          globalStyles.card,
          { 
            backgroundColor: `${colors.error}10`,
            borderLeftWidth: 4,
            borderLeftColor: colors.error
          }
        ]}
        onPress={handleLogout}
      >
        <View style={[globalStyles.row, { justifyContent: 'center' }]}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>🚪</Text>
          <Text style={[globalStyles.subtitle, { color: colors.error }]}>
            Déconnexion
          </Text>
        </View>
      </TouchableOpacity>

      {/* Version */}
      <View style={[globalStyles.card, globalStyles.center]}>
        <Text style={globalStyles.textLight}>ZouDou-Souk Mobile</Text>
        <Text style={[globalStyles.textLight, { fontSize: 12, marginTop: 4 }]}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;