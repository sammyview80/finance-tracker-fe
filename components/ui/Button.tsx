import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...rest
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  // Determine button styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: isDark ? '#333333' : '#E0E0E0',
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: isDark ? Colors.dark.tint : Colors.light.tint,
          borderWidth: 1,
        };
      case 'danger':
        return {
          backgroundColor: isDark ? '#CF6679' : '#F44336',
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
          borderColor: 'transparent',
        };
    }
  };

  // Determine text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return isDark ? '#FFFFFF' : '#FFFFFF';
      case 'secondary':
        return isDark ? '#FFFFFF' : '#000000';
      case 'outline':
        return isDark ? Colors.dark.tint : Colors.light.tint;
      case 'danger':
        return '#FFFFFF';
      default:
        return isDark ? '#FFFFFF' : '#FFFFFF';
    }
  };

  // Determine button size
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 4,
        };
      case 'medium':
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 6,
        };
      case 'large':
        return {
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 8,
        };
      default:
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 6,
        };
    }
  };

  // Determine text size
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getButtonStyle(),
        getButtonSize(),
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? (isDark ? Colors.dark.tint : Colors.light.tint) : '#FFFFFF'} 
        />
      ) : (
        <Text
          style={[
            styles.text,
            { color: getTextColor(), fontSize: getTextSize() },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button; 