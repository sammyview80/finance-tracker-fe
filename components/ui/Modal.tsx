import React from 'react';
import { 
  Modal as RNModal, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  ViewStyle,
  TextStyle,
  ModalProps as RNModalProps
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

interface ModalProps extends RNModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  showCloseButton?: boolean;
  closeButtonPosition?: 'top-right' | 'top-left';
  closeButtonColor?: string;
  closeButtonSize?: number;
  animationType?: 'none' | 'slide' | 'fade';
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  containerStyle,
  contentStyle,
  titleStyle,
  showCloseButton = true,
  closeButtonPosition = 'top-right',
  closeButtonColor,
  closeButtonSize = 20,
  animationType = 'fade',
  ...rest
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const closeButtonStyles = {
    position: 'absolute',
    top: 16,
    ...(closeButtonPosition === 'top-right' ? { right: 16 } : { left: 16 }),
  } as ViewStyle;

  return (
    <RNModal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType={animationType}
      {...rest}
    >
      <TouchableOpacity
        style={[
          styles.overlay,
          { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)' },
          containerStyle,
        ]}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.content,
            {
              backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
              borderColor: isDark ? '#333333' : '#E0E0E0',
            },
            contentStyle,
          ]}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {title && (
            <Text
              style={[
                styles.title,
                { color: isDark ? Colors.dark.text : Colors.light.text },
                titleStyle,
              ]}
            >
              {title}
            </Text>
          )}

          {showCloseButton && (
            <TouchableOpacity
              style={closeButtonStyles}
              onPress={onClose}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <FontAwesome
                name="close"
                size={closeButtonSize}
                color={closeButtonColor || (isDark ? Colors.dark.text : Colors.light.text)}
              />
            </TouchableOpacity>
          )}

          <View style={styles.childrenContainer}>{children}</View>
        </View>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingRight: 24, // Space for close button
  },
  childrenContainer: {
    marginTop: 8,
  },
});

export default Modal; 