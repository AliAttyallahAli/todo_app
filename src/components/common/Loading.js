import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';

const LoadingScreen = ({ message = 'Chargement...', size = 'large' }) => {
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[globalStyles.container, globalStyles.center, { padding: 20 }]}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            borderWidth: 4,
            borderColor: colors.primary,
            borderTopColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 20, color: colors.primary }}>ZS</Text>
        </View>
      </Animated.View>
      <Text style={[globalStyles.text, { marginTop: 16 }]}>{message}</Text>
    </View>
  );
};

export const InlineLoading = ({ message = 'Chargement...' }) => (
  <View style={[globalStyles.row, { padding: 16, justifyContent: 'center' }]}>
    <ActivityIndicator size="small" color={colors.primary} />
    <Text style={[globalStyles.text, { marginLeft: 8 }]}>{message}</Text>
  </View>
);

export const SkeletonLoader = ({ width = '100%', height = 20, style = {} }) => (
  <View
    style={[
      {
        width,
        height,
        backgroundColor: colors.border,
        borderRadius: 4,
      },
      style,
    ]}
  />
);

export default LoadingScreen;