import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { globalStyles, colors } from '../../styles/global';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.8;
const BOTTOM_SHEET_MIN_HEIGHT = 200;

const BottomSheet = ({ 
  visible, 
  onClose, 
  title, 
  children,
  snapPoints = [BOTTOM_SHEET_MIN_HEIGHT, BOTTOM_SHEET_MAX_HEIGHT]
}) => {
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_MAX_HEIGHT)).current;
  const lastGestureDy = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateY.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (_, gesture) => {
        translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        translateY.flattenOffset();
        lastGestureDy.current += gesture.dy;

        if (gesture.dy > 0) {
          // Swiping down
          if (gesture.dy > BOTTOM_SHEET_MAX_HEIGHT * 0.4) {
            closeBottomSheet();
          } else {
            openBottomSheet();
          }
        } else {
          // Swiping up
          openBottomSheet();
        }
      },
    })
  ).current;

  const openBottomSheet = () => {
    lastGestureDy.current = 0;
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
    }).start();
  };

  const closeBottomSheet = () => {
    lastGestureDy.current = BOTTOM_SHEET_MAX_HEIGHT;
    Animated.spring(translateY, {
      toValue: BOTTOM_SHEET_MAX_HEIGHT,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
    }).start(() => {
      onClose();
    });
  };

  useEffect(() => {
    if (visible) {
      openBottomSheet();
    } else {
      closeBottomSheet();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        onPress={closeBottomSheet}
        activeOpacity={1}
      />
      
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateY }],
            maxHeight: BOTTOM_SHEET_MAX_HEIGHT,
          }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        {title && (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34, // Safe area for home indicator
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default BottomSheet;