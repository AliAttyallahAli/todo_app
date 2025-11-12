import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={[globalStyles.container, globalStyles.center, { padding: 20 }]}>
          <Text style={[globalStyles.title, { color: colors.error, textAlign: 'center' }]}>
            Oups ! Quelque chose s'est mal passé
          </Text>
          <Text style={[globalStyles.text, { textAlign: 'center', marginVertical: 16 }]}>
            Nous rencontrons un problème technique. Veuillez réessayer.
          </Text>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={globalStyles.buttonText}>Réessayer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.button, { marginTop: 12, backgroundColor: colors.info }]}
            onPress={() => {/* Navigate to home */}}
          >
            <Text style={globalStyles.buttonText}>Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;