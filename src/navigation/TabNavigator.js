import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import des écrans
import HomeScreen from '../components/home/HomeScreen';
import MarketplaceScreen from '../components/marketplace/MarketplaceScreen';
import WalletScreen from '../components/wallet/WalletScreen';
import ServicesScreen from '../components/services/ServicesScreen';
import ProfileScreen from '../components/profile/ProfileScreen';
import ProductDetail from '../components/marketplace/ProductDetail';
import P2PTransfer from '../components/wallet/P2PTransfer';
import ServicePayment from '../components/services/ServicePayment';
import EditProfile from '../components/profile/EditProfile';
import KycForm from '../components/profile/KycForm';
import VendorDashboard from '../components/vendor/VendorDashboard';
import AddProduct from '../components/vendor/AddProduct';
import OrderManagement from '../components/vendor/OrderManagement';
import SettingsScreen from '../components/settings/SettingsScreen';
import CartScreen from '../components/marketplace/CartScreen';
import SearchScreen from '../components/marketplace/SearchScreen';
import TransactionHistory from '../components/wallet/TransactionHistory';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MarketplaceStack = createStackNavigator();
const WalletStack = createStackNavigator();
const ServicesStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Stack Navigators
const HomeStackNavigator = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
        />
    </HomeStack.Navigator>
);

const MarketplaceStackNavigator = () => (
    <MarketplaceStack.Navigator>
        <MarketplaceStack.Screen
            name="Marketplace"
            component={MarketplaceScreen}
            options={{ headerShown: false }}
        />
        <MarketplaceStack.Screen
            name="ProductDetail"
            component={ProductDetail}
            options={{ title: 'Détails Produit' }}
        />
        <MarketplaceStack.Screen
            name="Search"
            component={SearchScreen}
            options={{ title: 'Recherche' }}
        />
        <MarketplaceStack.Screen
            name="Cart"
            component={CartScreen}
            options={{ title: 'Mon Panier' }}
        />
    </MarketplaceStack.Navigator>
);

const WalletStackNavigator = () => (
    <WalletStack.Navigator>
        <WalletStack.Screen
            name="Wallet"
            component={WalletScreen}
            options={{ headerShown: false }}
        />
        <WalletStack.Screen
            name="P2PTransfer"
            component={P2PTransfer}
            options={{ title: 'Transfert P2P' }}
        />
        <WalletStack.Screen
            name="TransactionHistory"
            component={TransactionHistory}
            options={{ title: 'Historique' }}
        />
    </WalletStack.Navigator>
);

const ServicesStackNavigator = () => (
    <ServicesStack.Navigator>
        <ServicesStack.Screen
            name="Services"
            component={ServicesScreen}
            options={{ headerShown: false }}
        />
        <ServicesStack.Screen
            name="ServicePayment"
            component={ServicePayment}
            options={({ route }) => ({
                title: route.params?.service?.nom || 'Paiement'
            })}
        />
    </ServicesStack.Navigator>
);
const VendorStack = createStackNavigator();

const VendorStackNavigator = () => (
    <VendorStack.Navigator>
        <VendorStack.Screen
            name="VendorDashboard"
            component={VendorDashboard}
            options={{ headerShown: false }}
        />
        <VendorStack.Screen
            name="AddProduct"
            component={AddProduct}
            options={{ title: 'Ajouter un produit' }}
        />
        <VendorStack.Screen
            name="OrderManagement"
            component={OrderManagement}
            options={{ title: 'Gestion des commandes' }}
        />
    </VendorStack.Navigator>
);

const ProfileStackNavigator = () => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
        />
        <ProfileStack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ title: 'Modifier le profil' }}
        />
        <ProfileStack.Screen
            name="KYC"
            component={KycForm}
            options={{ title: 'Vérification KYC' }}
        />
        <ProfileStack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Paramètres' }}
        />
    </ProfileStack.Navigator>
);


const TabNavigator = () => {
    const { isVendeur, user } = useAuth();
    const [cartItemsCount, setCartItemsCount] = useState(0);

    // Charger le nombre d'articles dans le panier
    useEffect(() => {
        loadCartItemsCount();
    }, []);

    const loadCartItemsCount = async () => {
        const items = await storage.getItem(StorageKeys.CART_ITEMS) || [];
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemsCount(count);
    };
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Accueil') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Marketplace') {
                        iconName = focused ? 'shopping' : 'shopping-outline';
                    } else if (route.name === 'Panier') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'Portefeuille') {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                    } else if (route.name === 'Services') {
                        iconName = focused ? 'flash' : 'flash-outline';
                    } else if (route.name === 'Profil') {
                        iconName = focused ? 'account' : 'account-outline';
                    } else if (route.name === 'Vendeur') {
                        iconName = focused ? 'store' : 'store-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2c5530',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Accueil" component={HomeStackNavigator} />
            <Tab.Screen name="Marketplace" component={MarketplaceStackNavigator} />
                <Tab.Screen
                    name="panier"
                    component={CartScreen}
                    options={{
                        tabBarBadge: cartItemsCount > 0 ? cartItemsCount : undefined,
                    }}
                />
      
                {isVendeur && (
                <Tab.Screen name="Vendeur" component={VendorStackNavigator} />
            )}

            <Tab.Screen name="Accueil" component={HomeStackNavigator} />
            <Tab.Screen name="Marketplace" component={MarketplaceStackNavigator} />
            <Tab.Screen name="Portefeuille" component={WalletStackNavigator} />
            <Tab.Screen name="Services" component={ServicesStackNavigator} />
            <Tab.Screen name="Profil" component={ProfileStackNavigator} />
            <Tab.Screen name="Portefeuille" component={WalletStackNavigator} />
            <Tab.Screen name="Services" component={ServicesStackNavigator} />
            <Tab.Screen name="Profil" component={ProfileStackNavigator} />
        </Tab.Navigator>
    );
};

export default TabNavigator;