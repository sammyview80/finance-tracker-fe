import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  destructive?: boolean;
  showChevron?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
  destructive = false,
  showChevron = true,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  const getIconColor = () => {
    if (destructive) {
      return isDark ? '#FF6B6B' : '#D32F2F';
    }
    return isDark ? Colors.dark.tint : Colors.light.tint;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[
        styles.iconContainer,
        destructive ? styles.destructiveIconContainer : 
        { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(10, 126, 164, 0.1)' }
      ]}>
        <Ionicons name={icon as any} size={20} color={getIconColor()} />
      </View>
      
      <View style={styles.textContainer}>
        <ThemedText 
          style={[
            styles.title, 
            destructive && { color: isDark ? '#FF6B6B' : '#D32F2F' }
          ]}
        >
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        )}
      </View>
      
      {rightComponent ? (
        <View style={styles.rightComponent}>
          {rightComponent}
        </View>
      ) : (
        showChevron && onPress && (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDark ? Colors.dark.icon : Colors.light.icon} 
          />
        )
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  destructiveIconContainer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  rightComponent: {
    marginLeft: 8,
  },
});

export default SettingsItem; 