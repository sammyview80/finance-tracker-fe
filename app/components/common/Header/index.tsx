import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useDrawer } from '@/app/components/common/Drawer/DrawerProvider';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  onMenuPress?: () => void; // Optional prop to handle menu press if drawer is not available
}

const HeaderContent: React.FC<HeaderProps & { openDrawer: () => void }> = ({ 
  title, 
  showBackButton = false, 
  rightComponent,
  openDrawer
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentTheme } = useTheme();
  const textColor = currentTheme === 'dark' ? '#FFFFFF' : '#000000';
  const pathname = usePathname();
  
  // Check if we're in the tabs section
  const isInTabs = pathname.startsWith('/(tabs)');

  return (
    <View 
      style={[
        styles.container, 
        { paddingTop: insets.top + 10 }
      ]}
    >
      <View style={styles.leftContainer}>
        {showBackButton ? (
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.iconButton}
          >
            <FontAwesome name="arrow-left" size={20} color={textColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={openDrawer} 
            style={styles.iconButton}
          >
            <FontAwesome name="bars" size={20} color={textColor} />
          </TouchableOpacity>
        )}
      </View>
      
      <ThemedText style={styles.title}>{title}</ThemedText>
      
      <View style={styles.rightContainer}>
        {rightComponent || <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

// Wrapper component that uses the drawer context
const Header: React.FC<HeaderProps> = (props) => {
  try {
    // Try to use the drawer context
    const { openDrawer } = useDrawer();
    return <HeaderContent {...props} openDrawer={openDrawer} />;
  } catch (error) {
    // If drawer context is not available, use the onMenuPress prop or a no-op function
    const openDrawer = props.onMenuPress || (() => console.warn('Drawer not available'));
    return <HeaderContent {...props} openDrawer={openDrawer} />;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  leftContainer: {
    width: 40,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 8,
  },
  placeholder: {
    width: 36,
    height: 36,
  },
});

export default Header; 