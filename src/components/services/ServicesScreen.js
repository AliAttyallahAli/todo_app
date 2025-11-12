import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { servicesAPI } from '../../services/services';

const ServicesScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.services);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };

  const ServiceCard = ({ service }) => {
    const getServiceConfig = (type) => {
      switch (type) {
        case 'ZIZ':
          return { icon: '⚡', color: colors.ziz, name: 'ZIZ - Électricité' };
        case 'STE':
          return { icon: '💧', color: colors.ste, name: 'STE - Eau' };
        case 'TAXE':
          return { icon: '🏛️', color: colors.tax, name: 'TAXE - Taxes' };
        default:
          return { icon: '🏢', color: colors.primary, name: service.nom };
      }
    };

    const config = getServiceConfig(service.type);

    return (
      <TouchableOpacity
        style={[
          globalStyles.card,
          {
            borderLeftWidth: 4,
            borderLeftColor: config.color,
            marginBottom: 12,
          }
        ]}
        onPress={() => navigation.navigate('ServicePayment', { service })}
      >
        <View style={globalStyles.row}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: `${config.color}20`,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 20 }}>{config.icon}</Text>
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.subtitle}>{config.name}</Text>
            <Text style={globalStyles.textLight} numberOfLines={2}>
              {service.description}
            </Text>
            
            {service.entreprise_nom && (
              <View style={[globalStyles.row, { marginTop: 4 }]}>
                <Text style={[globalStyles.textLight, { fontSize: 12 }]}>
                  {service.entreprise_nom}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={{ color: colors.primary, fontSize: 20 }}>→</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const QuickService = ({ icon, title, description, color, onPress }) => (
    <TouchableOpacity
      style={[
        globalStyles.card,
        {
          flex: 1,
          margin: 4,
          minHeight: 120,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: `${color}10`,
          borderWidth: 1,
          borderColor: `${color}30`,
        }
      ]}
      onPress={onPress}
    >
      <Text style={{ fontSize: 32, marginBottom: 8 }}>{icon}</Text>
      <Text style={[globalStyles.text, { textAlign: 'center', fontWeight: '600' }]}>
        {title}
      </Text>
      <Text style={[globalStyles.textLight, { textAlign: 'center', fontSize: 12, marginTop: 4 }]}>
        {description}
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
      {/* En-tête */}
      <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
        <Text style={[globalStyles.title, { color: '#fff', textAlign: 'center' }]}>
          ⚡ Services
        </Text>
        <Text style={[globalStyles.textLight, { color: '#fff', textAlign: 'center' }]}>
          Payez vos factures en toute sécurité
        </Text>
      </View>

      {/* Services rapides */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Services Principaux</Text>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <QuickService
            icon="⚡"
            title="ZIZ"
            description="Électricité"
            color={colors.ziz}
            onPress={() => navigation.navigate('ServicePayment', { 
              service: { type: 'ZIZ', nom: 'ZIZ - Électricité' } 
            })}
          />
          <QuickService
            icon="💧"
            title="STE"
            description="Eau"
            color={colors.ste}
            onPress={() => navigation.navigate('ServicePayment', { 
              service: { type: 'STE', nom: 'STE - Eau' } 
            })}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <QuickService
            icon="🏛️"
            title="TAXE"
            description="Taxes"
            color={colors.tax}
            onPress={() => navigation.navigate('ServicePayment', { 
              service: { type: 'TAXE', nom: 'TAXE - Taxes communales' } 
            })}
          />
          <QuickService
            icon="📊"
            title="Autres"
            description="Services"
            color={colors.primary}
            onPress={() => {/* Navigate to other services */}}
          />
        </View>
      </View>

      {/* Tous les services */}
      <View style={globalStyles.card}>
        <View style={globalStyles.spaceBetween}>
          <Text style={globalStyles.subtitle}>Tous les services</Text>
          <Text style={globalStyles.textLight}>
            {services.length} service(s)
          </Text>
        </View>

        <FlatList
          data={services}
          renderItem={({ item }) => <ServiceCard service={item} />}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          style={{ marginTop: 12 }}
        />
      </View>

      {/* Comment ça marche */}
      <View style={[globalStyles.card, { backgroundColor: `${colors.info}10` }]}>
        <Text style={[globalStyles.subtitle, { color: colors.info }]}>
          📋 Comment ça marche ?
        </Text>
        
        <View style={{ marginTop: 12 }}>
          <Step number={1} title="Sélectionnez le service" />
          <Step number={2} title="Renseignez vos informations" />
          <Step number={3} title="Confirmez le paiement" />
          <Step number={4} title="Recevez la confirmation" />
        </View>
      </View>

      {/* Support */}
      <TouchableOpacity
        style={[
          globalStyles.card,
          { 
            backgroundColor: `${colors.warning}10`,
            borderLeftWidth: 4,
            borderLeftColor: colors.warning
          }
        ]}
        onPress={() => {/* Navigate to support */}}
      >
        <View style={globalStyles.row}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>💬</Text>
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.subtitle}>Besoin d'aide ?</Text>
            <Text style={globalStyles.textLight}>
              Notre équipe support est disponible pour vous aider
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Step = ({ number, title }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
    <View
      style={{
        width: 24,
        height: 24,
        backgroundColor: colors.info,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
        {number}
      </Text>
    </View>
    <Text style={globalStyles.text}>{title}</Text>
  </View>
);

export default ServicesScreen;