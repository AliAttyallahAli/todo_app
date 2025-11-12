import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { globalStyles, colors } from '../../styles/global';

const CustomButton = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary',
  style = {} 
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'secondary': return colors.secondary;
      case 'danger': return colors.error;
      case 'success': return colors.success;
      default: return colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        globalStyles.button,
        {
          backgroundColor: getBackgroundColor(),
          opacity: disabled ? 0.6 : 1,
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={globalStyles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;