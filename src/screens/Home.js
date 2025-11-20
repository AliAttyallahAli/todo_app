import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import styles, { colors, spacing, typography } from '../styles/global';

const Home = ({ navigation }) => {
  const { user } = useAuth();

  const services = [
    {
      title: 'Marketplace',
      description: 'Achetez et vendez des produits locaux',
      icon: '🛍️',
      screen: 'Marketplace'
    },
    {
      title: 'P2P Transfert',
      description: 'Envoyez de l\'argent entre utilisateurs',
      icon: '💸',
      screen: 'P2P'
    },
    {
      title: 'Services',
      description: 'Payez vos factures en ligne',
      icon: '🧾',
      screen: 'Services'
    },
    {
      title: 'Mon Profil',
      description: 'Gérez votre compte et wallet',
      icon: '👤',
      screen: 'Profil'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.screenContainer}>
        
        {/* Hero Section */}
        <View style={[styles.card, { backgroundColor: colors.primary }]}>
          <Text style={[typography.h1, { color: colors.white }]}>
            Bienvenue{user ? `, ${user.prenom}` : ''}!
          </Text>
          <Text style={[typography.body, { color: colors.white, marginTop: spacing.sm }]}>
            ZouDou-Souk - Votre marketplace tchadienne
          </Text>
          
          {user?.role === 'client' && (
            <TouchableOpacity 
              style={[styles.buttonOutline, { 
                marginTop: spacing.lg,
                borderColor: colors.white 
              }]}
              onPress={() => navigation.navigate('Profil')}
            >
              <Text style={[styles.buttonOutlineText, { color: colors.white }]}>
                Devenir vendeur
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Services Grid */}
        <Text style={[typography.h2, { marginVertical: spacing.lg }]}>
          Nos Services
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { width: '48%', marginBottom: spacing.md }]}
              onPress={() => navigation.navigate(service.screen)}
            >
              <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: spacing.sm }}>
                {service.icon}
              </Text>
              <Text style={[typography.h3, styles.textCenter, styles.mbSm]}>
                {service.title}
              </Text>
              <Text style={[typography.caption, styles.textCenter]}>
                {service.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={[styles.card, { marginTop: spacing.lg }]}>
          <Text style={[typography.h3, styles.mbMd]}>
            ZouDou-Souk en chiffres
          </Text>
          <View style={[styles.row, styles.spaceBetween]}>
            <View style={styles.center}>
              <Text style={[typography.h2, { color: colors.primary }]}>500+</Text>
              <Text style={typography.caption}>Utilisateurs</Text>
            </View>
            <View style={styles.center}>
              <Text style={[typography.h2, { color: colors.primary }]}>1K+</Text>
              <Text style={typography.caption}>Produits</Text>
            </View>
            <View style={styles.center}>
              <Text style={[typography.h2, { color: colors.primary }]}>5K+</Text>
              <Text style={typography.caption}>Transactions</Text>
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

export default Home;