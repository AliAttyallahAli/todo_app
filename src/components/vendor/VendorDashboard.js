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
import { useAuth } from '../../context/AuthContext';
import { productsAPI } from '../../services/products';
import { walletAPI } from '../../services/wallet';

const VendorDashboard = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    activeProducts: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Charger les statistiques
      const productsResponse = await productsAPI.getByVendeur(user.id);
      const transactionsResponse = await walletAPI.getVendeurTransactions();
      
      const activeProducts = productsResponse.data.products?.length || 0;
      const recentTransactions = transactionsResponse.data.transactions || [];
      
      const totalRevenue = recentTransactions.reduce((sum, transaction) => 
        sum + parseFloat(transaction.amount), 0
      );
      
      const pendingOrders = recentTransactions.filter(t => 
        t.status === 'pending'
      ).length;

      setStats({
        totalSales: recentTransactions.length,
        totalRevenue,
        activeProducts,
        pendingOrders
      });

      setRecentOrders(recentTransactions.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, subtitle, color = colors.primary }) => (
    <View
      style={[
        globalStyles.card,
        {
          flex: 1,
          margin: 4,
          backgroundColor: `${color}10`,
          borderLeftWidth: 4,
          borderLeftColor: color,
        }
      ]}
    >
      <Text style={[globalStyles.subtitle, { color, fontSize: 16 }]}>
        {title}
      </Text>
      <Text style={[globalStyles.title, { color, fontSize: 24, marginVertical: 4 }]}>
        {value}
      </Text>
      <Text style={[globalStyles.textLight, { fontSize: 12 }]}>
        {subtitle}
      </Text>
    </View>
  );

  const OrderItem = ({ order }) => (
    <TouchableOpacity
      style={[
        globalStyles.card,
        {
          marginBottom: 8,
          borderLeftWidth: 4,
          borderLeftColor: order.status === 'pending' ? colors.warning : 
                         order.status === 'completed' ? colors.success : colors.error
        }
      ]}
    >
      <View style={globalStyles.spaceBetween}>
        <Text style={globalStyles.text} numberOfLines={1}>
          Commande #{order.id}
        </Text>
        <Text style={[globalStyles.text, { color: colors.primary, fontWeight: '600' }]}>
          {parseFloat(order.amount).toLocaleString()} FCFA
        </Text>
      </View>
      <View style={[globalStyles.spaceBetween, { marginTop: 4 }]}>
        <Text style={globalStyles.textLight}>
          {order.from_nom} {order.from_prenom}
        </Text>
        <View
          style={{
            backgroundColor: order.status === 'pending' ? `${colors.warning}20` :
                            order.status === 'completed' ? `${colors.success}20` : `${colors.error}20`,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{
            color: order.status === 'pending' ? colors.warning :
                   order.status === 'completed' ? colors.success : colors.error,
            fontSize: 12,
            fontWeight: '600',
          }}>
            {order.status === 'pending' ? 'En attente' :
             order.status === 'completed' ? 'Complété' : 'Annulé'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickAction = ({ icon, title, onPress, color = colors.primary }) => (
    <TouchableOpacity
      style={[
        globalStyles.center,
        {
          flex: 1,
          margin: 8,
          padding: 16,
          backgroundColor: `${color}10`,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: `${color}30`,
        }
      ]}
      onPress={onPress}
    >
      <Text style={{ fontSize: 24, marginBottom: 8 }}>{icon}</Text>
      <Text style={[globalStyles.text, { textAlign: 'center', fontSize: 12 }]}>
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
      {/* En-tête */}
      <View style={[globalStyles.card, { backgroundColor: colors.primary }]}>
        <Text style={[globalStyles.title, { color: '#fff' }]}>
          Dashboard Vendeur
        </Text>
        <Text style={[globalStyles.textLight, { color: '#fff' }]}>
          Bienvenue dans votre espace vendeur
        </Text>
      </View>

      {/* Statistiques */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Aperçu des ventes</Text>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <StatCard
            title="Ventes totales"
            value={stats.totalSales}
            subtitle="Commandes"
            color={colors.primary}
          />
          <StatCard
            title="Revenus"
            value={stats.totalRevenue.toLocaleString()}
            subtitle="FCFA"
            color={colors.success}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <StatCard
            title="Produits actifs"
            value={stats.activeProducts}
            subtitle="En ligne"
            color={colors.info}
          />
          <StatCard
            title="En attente"
            value={stats.pendingOrders}
            subtitle="Commandes"
            color={colors.warning}
          />
        </View>
      </View>

      {/* Actions rapides */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Actions rapides</Text>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <QuickAction
            icon="➕"
            title="Ajouter produit"
            onPress={() => navigation.navigate('AddProduct')}
            color={colors.success}
          />
          <QuickAction
            icon="📦"
            title="Gérer stocks"
            onPress={() => {/* Navigate to stock management */}}
            color={colors.info}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <QuickAction
            icon="📊"
            title="Statistiques"
            onPress={() => {/* Navigate to analytics */}}
            color={colors.warning}
          />
          <QuickAction
            icon="⚙️"
            title="Paramètres"
            onPress={() => {/* Navigate to vendor settings */}}
            color={colors.primary}
          />
        </View>
      </View>

      {/* Commandes récentes */}
      <View style={globalStyles.card}>
        <View style={globalStyles.spaceBetween}>
          <Text style={globalStyles.subtitle}>Commandes récentes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OrderManagement')}>
            <Text style={[globalStyles.text, { color: colors.primary }]}>
              Voir tout
            </Text>
          </TouchableOpacity>
        </View>

        {recentOrders.length > 0 ? (
          <FlatList
            data={recentOrders}
            renderItem={({ item }) => <OrderItem order={item} />}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            style={{ marginTop: 12 }}
          />
        ) : (
          <View style={[globalStyles.center, { padding: 20 }]}>
            <Text style={[globalStyles.textLight, { textAlign: 'center' }]}>
              Aucune commande récente
            </Text>
            <Text style={[globalStyles.textLight, { textAlign: 'center', fontSize: 12 }]}>
              Vos commandes apparaîtront ici
            </Text>
          </View>
        )}
      </View>

      {/* Performance */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Performance du mois</Text>
        <View style={[globalStyles.center, { padding: 20 }]}>
          <Text style={globalStyles.textLight}>
            Graphiques de performance à venir
          </Text>
        </View>
      </View>

      {/* Conseils */}
      <View style={[globalStyles.card, { backgroundColor: `${colors.info}10` }]}>
        <Text style={[globalStyles.subtitle, { color: colors.info }]}>
          💡 Conseils pour augmenter vos ventes
        </Text>
        <Text style={[globalStyles.textLight, { marginTop: 8 }]}>
          • Ajoutez des photos de qualité{'\n'}
          • Répondez rapidement aux messages{'\n'}
          • Mettez à jour vos stocks régulièrement{'\n'}
          • Proposez des options de livraison
        </Text>
      </View>
    </ScrollView>
  );
};

export default VendorDashboard;