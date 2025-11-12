import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';

const Modal = ({ 
  visible, 
  onClose, 
  title, 
  children, 
  showCloseButton = true,
  animationType = 'slide',
  presentationStyle = 'pageSheet'
}) => {
  return (
    <RNModal
      animationType={animationType}
      presentationStyle={presentationStyle}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {showCloseButton && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '300',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default Modal;