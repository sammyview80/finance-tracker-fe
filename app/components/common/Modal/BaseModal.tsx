import React, { useRef } from 'react';
import { Modal, Pressable, View, Animated, PanResponder, ModalProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createModalStyles } from './styles';
import { useTheme } from '@/contexts/ThemeContext';

interface BaseModalProps extends Omit<ModalProps, 'visible' | 'onRequestClose'> {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  modalStyle?: object;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  children,
  animationType = 'slide',
  modalStyle = {},
  ...rest
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const styles = createModalStyles(isDark);
  
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.y.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.spring(pan.y, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent
      onRequestClose={onClose}
      statusBarTranslucent={true}
      {...rest}
    >
      <View style={styles.overlay}>
        <Pressable 
          style={styles.container} 
          onPress={onClose}
        >
          <SafeAreaView edges={['bottom']} style={{ width: '100%' }}>
            <Animated.View 
              style={[
                styles.modal, 
                { transform: [{ translateY: pan.y }] },
                modalStyle
              ]} 
              {...panResponder.panHandlers}
            >
              <Pressable onPress={(e) => e.stopPropagation()}>
                <View style={styles.dragHandle} />
                {children}
              </Pressable>
            </Animated.View>
          </SafeAreaView>
        </Pressable>
      </View>
    </Modal>
  );
};

export default BaseModal;