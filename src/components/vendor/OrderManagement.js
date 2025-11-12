import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { useAuth } from '../../context/AuthContext';
import { walletAPI } from '../../services/wallet';

const OrderManagement = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await walletAPI.getVendeurTransactions();
      setOrders(response.data.transactions || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Erreur', 'Impossible de charger les commandes');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Implémenter la mise à jour du statut
      Alert.alert('Succès', `Commande ${newStatus} avec succès`);
      loadOrders(); // Recharger les données
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.textLight;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'completed': return 'Complétée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const OrderCard = ({ order }) => (
    <View style={[globalStyles.card, { marginBottom: 12 }]}>
      <View style={globalStyles.spaceBetween}>
        <Text style={[globalStyles.text, { fontWeight: '600' }]}>
          Commande #{order.id}
        </Text>
        <View style={{
          backgroundColor: `${getStatusColor(order.status)}20`,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{ color: getStatusColor(order.status), fontSize: 12, fontWeight: '600' }}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      <View style={[globalStyles.spaceBetween, { marginTop: 8 }]}>
        <Text style={globalStyles.textLight}>Client:</Text>
        <Text style={globalStyles.text}>
          {order.from_nom} {order.from_prenom}
        </Text>
      </View>

      <View style={[globalStyles.spaceBetween, { marginTop: 4 }]}>
        <Text style={globalStyles.textLight}>Montant:</Text>
        <Text style={[globalStyles.text, { fontWeight: '600', color: colors.primary }]}>
          {parseFloat(order.amount).toLocaleString()} FCFA
        </Text>
      </View>

      <View style={[globalStyles.spaceBetween, { marginTop: 4 }]}>
        <Text style={globalStyles.textLight}>Date:</Text>
        <Text style={globalStyles.textLight}>
          {new Date(order.created_at).toLocaleDateString('fr-FR')}
        </Text>
      </View>

      {order.product_nom && (
        <View style={{ marginTop: 8 }}>
          <Text style={globalStyles.textLight}>Produit:</Text>
          <Text style={globalStyles.text}>{order.product_nom}</Text>
        </View>
      )}

      {/* Actions selon le statut */}
      {order.status === 'pending' && (
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1, marginRight: 8, backgroundColor: colors.success }]}
            onPress={() => updateOrderStatus(order.id, 'completed')}
          >
            <Text style={globalStyles.buttonText}>Marquer comme livré</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1, marginLeft: 8, backgroundColor: colors.error }]}
            onPress={() => updateOrderStatus(order.id, 'cancelled')}
          >
            <Text style={globalStyles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === 'completed' && (
        <TouchableOpacity
          style={[globalStyles.button, { marginTop: 12, backgroundColor: colors.info }]}
          onPress={() => {/* Voir les détails */}}
        >
          <Text style={globalStyles.buttonText}>Voir les détails</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const FilterButton = ({ status, label, isActive }) => (
    <TouchableOpacity
      style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          marginRight: 8,
          backgroundColor: isActive ? colors.primary : colors.surface,
          borderWidth: 1,
          borderColor: isActive ? colors.primary : colors.border,
        }
      ]}
      onPress={() => setFilter(status)}
    >
      <Text style={{
        color: isActive ? '#fff' : colors.text,
        fontSize: 14,
        fontWeight: '500',
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      {/* Filtres */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <FilterButton status="all" label="Toutes" isActive={filter === 'all'} />
        <FilterButton status="pending" label="En attente" isActive={filter === 'pending'} />
        <FilterButton status="completed" label="Complétées" isActive={filter === 'completed'} />
        <FilterButton status="cancelled" label="Annulées" isActive={filter === 'cancelled'} />
      </ScrollView>

      {/* Liste des commandes */}
      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => <OrderCard order={item} />}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={[globalStyles.center, { padding: 40 }]}>
            <Text style={[globalStyles.textLight, { textAlign: 'center' }]}>
              Aucune commande {filter !== 'all' ? getStatusText(filter).toLowerCase() : ''}
            </Text>
            <Text style={[globalStyles.textLight, { textAlign: 'center', fontSize: 12, marginTop: 8 }]}>
              {filter === 'all' ? 'Vos commandes apparaîtront ici' : ''}
            </Text>
          </View>
        }
      />

      {/* Statistiques rapides */}
      <View style={[globalStyles.card, { margin: 16 }]}>
        <Text style={globalStyles.subtitle}>Aperçu des commandes</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 }}>
          <View style={globalStyles.center}>
            <Text style={[globalStyles.title, { color: colors.primary }]}>
              {orders.length}
            </Text>
            <Text style={globalStyles.textLight}>Total</Text>
          </View>
          <View style={globalStyles.center}>
            <Text style={[globalStyles.title, { color: colors.warning }]}>
              {orders.filter(o => o.status === 'pending').length}
            </Text>
            <Text style={globalStyles.textLight}>En attente</Text>
          </View>
          <View style={globalStyles.center}>
            <Text style={[globalStyles.title, { color: colors.success }]}>
              {orders.filter(o => o.status === 'completed').length}
            </Text>
            <Text style={globalStyles.textLight}>Complétées</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderManagement;