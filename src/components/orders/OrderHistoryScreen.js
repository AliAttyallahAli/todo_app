import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { walletAPI } from '../../services/wallet';

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await walletAPI.getTransactions();
      const achatOrders = response.data.transactions?.filter(t => t.type === 'achat') || [];
      setOrders(achatOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'cancelled': return colors.error;
      default: return colors.textLight;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Livré';
      case 'pending': return 'En cours';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const OrderCard = ({ order }) => (
    <TouchableOpacity
      style={[globalStyles.card, { marginBottom: 12 }]}
      onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
    >
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

      {order.product_nom && (
        <Text style={[globalStyles.text, { marginTop: 8 }]} numberOfLines={2}>
          {order.product_nom}
        </Text>
      )}

      <View style={[globalStyles.spaceBetween, { marginTop: 8 }]}>
        <Text style={globalStyles.textLight}>
          {new Date(order.created_at).toLocaleDateString('fr-FR')}
        </Text>
        <Text style={[globalStyles.text, { fontWeight: '600', color: colors.primary }]}>
          {parseFloat(order.amount).toLocaleString()} FCFA
        </Text>
      </View>

      <View style={[globalStyles.row, { marginTop: 8 }]}>
        <Text style={[globalStyles.textLight, { fontSize: 12 }]}>
          Vendeur: {order.to_nom} {order.to_prenom}
        </Text>
      </View>
    </TouchableOpacity>
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
        <FilterButton status="pending" label="En cours" isActive={filter === 'pending'} />
        <FilterButton status="completed" label="Livrées" isActive={filter === 'completed'} />
        <FilterButton status="cancelled" label="Annulées" isActive={filter === 'cancelled'} />
      </ScrollView>

      {/* Statistiques */}
      <View style={[globalStyles.card, { margin: 16 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={globalStyles.center}>
            <Text style={[globalStyles.title, { color: colors.primary }]}>
              {orders.length}
            </Text>
            <Text style={globalStyles.textLight}>Total</Text>
          </View>
          <View style={globalStyles.center}>
            <Text style={[globalStyles.title, { color: colors.success }]}>
              {orders.filter(o => o.status === 'completed').length}
            </Text>
            <Text style={globalStyles.textLight}>Livrées</Text>
          </View>
          <View style={globalStyles.center}>
            <Text style={[globalStyles.title, { color: colors.warning }]}>
              {orders.filter(o => o.status === 'pending').length}
            </Text>
            <Text style={globalStyles.textLight}>En cours</Text>
          </View>
        </View>
      </View>

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
    </View>
  );
};

export default OrderHistoryScreen;