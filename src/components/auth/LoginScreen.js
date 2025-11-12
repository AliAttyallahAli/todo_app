import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erreur de connexion', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[globalStyles.screen, { justifyContent: 'center' }]}>
          
          {/* Header */}
          <View style={[globalStyles.center, { marginBottom: 40 }]}>
            <View style={{
              width: 80,
              height: 80,
              backgroundColor: colors.primary,
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
              <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>ZS</Text>
            </View>
            <Text style={globalStyles.title}>ZouDou-Souk</Text>
            <Text style={[globalStyles.textLight, { textAlign: 'center' }]}>
              Connectez-vous à votre compte
            </Text>
          </View>

          {/* Formulaire */}
          <View style={globalStyles.card}>
            <Text style={[globalStyles.subtitle, { marginBottom: 20 }]}>
              Connexion
            </Text>

            <TextInput
              style={globalStyles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={globalStyles.input}
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[
                globalStyles.button,
                { marginTop: 20 },
                loading && { opacity: 0.7 }
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={globalStyles.buttonText}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 15 }}
              onPress={() => {/* TODO: Reset password */}}
            >
              <Text style={[globalStyles.textLight, { textAlign: 'center', color: colors.primary }]}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Inscription */}
          <View style={[globalStyles.card, { marginTop: 20 }]}>
            <View style={[globalStyles.row, { justifyContent: 'center' }]}>
              <Text style={globalStyles.textLight}>Pas de compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[globalStyles.text, { color: colors.primary, fontWeight: '600' }]}>
                  S'inscrire
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;