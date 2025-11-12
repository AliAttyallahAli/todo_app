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

const TransactionHistory = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await walletAPI.getTransactions();
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'p2p': return '📤';
      case 'achat': return '🛍️';
      case 'facture': return '⚡';
      case 'abonnement': return '🔄';
      default: return '💰';
    }
  };

  const getTransactionTypeText = (type) => {
    switch (type) {
      case 'p2p': return 'Transfert P2P';
      case 'achat': return 'Achat Marketplace';
      case 'facture': return 'Paiement Facture';
      case 'abonnement': return 'Abonnement';
      default: return type;
    }
  };

  const getAmountColor = (transaction, userPhone) => {
    if (transaction.from_wallet_phone === userPhone) {
      return colors.error; // Débit
    } else {
      return colors.success; // Crédit
    }
  };

  const getAmountPrefix = (transaction, userPhone) => {
    if (transaction.from_wallet_phone === userPhone) {
      return '-';
    } else {
      return '+';
    }
  };

  const TransactionItem = ({ transaction }) => (
    <TouchableOpacity
      style={[globalStyles.card, { marginBottom: 8 }]}
      onPress={() => {/* Voir les détails de la transaction */}}
    >
      <View style={globalStyles.row}>
        <Text style={{ fontSize: 24, marginRight: 12 }}>
          {getTransactionIcon(transaction.type)}
        </Text>
        
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.text}>
            {getTransactionTypeText(transaction.type)}
          </Text>
          <Text style={globalStyles.textLight}>
            {new Date(transaction.created_at).toLocaleDateString('fr-FR')} • 
            {new Date(transaction.created_at).toLocaleTimeString('fr-FR')}
          </Text>
          
          {transaction.service_type && (
            <Text style={[globalStyles.textLight, { fontSize: 12 }]}>
              Service: {transaction.service_type}
            </Text>
          )}
          
          {transaction.product_nom && (
            <Text style={[globalStyles.textLight, { fontSize: 12 }]}>
              Produit: {transaction.product_nom}
            </Text>
          )}
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[
            globalStyles.text,
            { 
              fontWeight: '600',
              color: getAmountColor(transaction, transaction.from_wallet_phone)
            }
          ]}>
            {getAmountPrefix(transaction, transaction.from_wallet_phone)}
            {parseFloat(transaction.amount).toLocaleString()} FCFA
          </Text>
          
          {transaction.fee > 0 && (
            <Text style={[globalStyles.textLight, { fontSize: 12 }]}>
              Frais: {parseFloat(transaction.fee).toLocaleString()} FCFA
            </Text>
          )}
          
          <View style={{
            backgroundColor: transaction.status === 'completed' ? `${colors.success}20` : 
                           transaction.status === 'pending' ? `${colors.warning}20` : `${colors.error}20`,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
            marginTop: 4,
          }}>
            <Text style={{
              color: transaction.status === 'completed' ? colors.success :
                     transaction.status === 'pending' ? colors.warning : colors.error,
              fontSize: 10,
              fontWeight: '600',
            }}>
              {transaction.status === 'completed' ? 'Complété' :
               transaction.status === 'pending' ? 'En attente' : 'Échoué'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ type, label, isActive }) => (
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
      onPress={() => setFilter(type)}
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
        <FilterButton type="all" label="Toutes" isActive={filter === 'all'} />
        <FilterButton type="p2p" label="Transferts" isActive={filter === 'p2p'} />
        <FilterButton type="achat" label="Achats" isActive={filter === 'achat'} />
        <FilterButton type="facture" label="Factures" isActive={filter === 'facture'} />
      </ScrollView>

      {/* Statistiques rapides */}
      <View style={[globalStyles.card, { margin: 16 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={globalStyles.center}>
            <Text style={[globalStyles.title, { color: colors.primary }]}>
              {transactions.length}
            </Text>
            <Text style={globalStyles.textLight}>Total</Text>
          </View>
          <View style={globalStyles.center}>
            <Text style={[globalStyles.title, { color: colors.success }]}>
              {transactions.filter(t => t.status === 'completed').length}
            </Text>
            <Text style={globalStyles.textLight}>Complétées</Text>
          </View>
          <View style={globalStyles.center}>
            <Text style={[globalStyles.title, { color: colors.warning }]}>
              {transactions.filter(t => t.status === 'pending').length}
            </Text>
            <Text style={globalStyles.textLight}>En attente</Text>
          </View>
        </View>
      </View>

      {/* Liste des transactions */}
      <FlatList
        data={filteredTransactions}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={[globalStyles.center, { padding: 40 }]}>
            <Text style={[globalStyles.textLight, { textAlign: 'center' }]}>
              Aucune transaction {filter !== 'all' ? getTransactionTypeText(filter).toLowerCase() : ''}
            </Text>
            <Text style={[globalStyles.textLight, { textAlign: 'center', fontSize: 12, marginTop: 8 }]}>
              {filter === 'all' ? 'Vos transactions apparaîtront ici' : ''}
            </Text>
          </View>
        }
      />

      {/* Export */}
      <TouchableOpacity
        style={[globalStyles.card, { margin: 16 }]}
        onPress={() => {/* Exporter l'historique */}}
      >
        <View style={[globalStyles.row, { justifyContent: 'center' }]}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>📊</Text>
          <Text style={[globalStyles.text, { fontWeight: '600' }]}>
            Exporter l'historique
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionHistory;