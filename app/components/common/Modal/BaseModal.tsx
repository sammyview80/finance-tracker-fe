import React, { useRef } from 'react';
import { Modal, Pressable, View, Animated, PanResponder, ModalProps } from 'react-native';
import { baseModalStyles as styles } from './styles';

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
      {...rest}
    >
      <Pressable style={styles.container} onPress={onClose}>
        <Animated.View 
          style={[
            styles.modal, 
            { transform: [{ translateY: pan.y }] },
            modalStyle
          ]} 
          {...panResponder.panHandlers}
        >
          <View style={styles.dragHandle} />
          {children}
        </Animated.View>
      </Pressable>
    </Modal>
  );
};