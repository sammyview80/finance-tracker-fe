import React, { useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  ScrollView,
  Switch,
  Image
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
}

const menuItems: MenuItem[] = [
  { id: '1', title: 'Dashboard', icon: 'home', route: '/' },
  { id: '2', title: 'Income', icon: 'arrow-up', route: '/transaction/add?type=income' },
  { id: '3', title: 'Expenses', icon: 'arrow-down', route: '/transaction/add?type=expense' },
  { id: '4', title: 'Transactions', icon: 'exchange', route: '/transactions' },
  { id: '5', title: 'Budget', icon: 'pie-chart', route: '/budget' },
  { id: '6', title: 'Savings', icon: 'bank', route: '/savings' },
  { id: '7', title: 'Reports', icon: 'bar-chart', route: '/reports' },
  { id: '8', title: 'Settings', icon: 'cog', route: '/settings' },
];

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, currentTheme, toggleTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = screenWidth * 0.75; // 75% of screen width
  
  // Use Reanimated shared values
  const translateX = useSharedValue(-drawerWidth);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      // Animate drawer to open position
      translateX.value = withTiming(0, { duration: 300 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      // Animate drawer to closed position
      translateX.value = withTiming(-drawerWidth, { duration: 300 });
      backdropOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isOpen, drawerWidth]);

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route as any);
  };

  // Create animated styles using Reanimated
  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
      // Only allow touches when drawer is open
      pointerEvents: backdropOpacity.value > 0 ? 'auto' as const : 'none' as const,
    };
  });

  return (
    <>
      {/* Backdrop */}
      <Animated.View 
        style={[
          styles.backdrop,
          backdropAnimatedStyle
        ]}
        // Close drawer when backdrop is tapped
        onTouchEnd={onClose}
      />
      
      {/* Drawer */}
      <Animated.View 
        style={[
          styles.drawer, 
          { 
            width: drawerWidth,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          },
          drawerAnimatedStyle
        ]}
      >
        {/* Header */}
        <View style={[
          styles.header,
          { borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
        ]}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <ThemedText style={styles.appName}>Finance Tracker</ThemedText>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons 
                name="close" 
                size={24} 
                color={isDark ? '#FFFFFF' : '#000000'} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView 
          style={styles.menuContainer}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                { borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }
              ]}
              onPress={() => handleNavigation(item.route)}
            >
              <View style={[
                styles.menuIconContainer,
                { 
                  backgroundColor: isDark 
                    ? 'rgba(76, 175, 80, 0.15)' 
                    : 'rgba(76, 175, 80, 0.1)' 
                }
              ]}>
                <FontAwesome 
                  name={item.icon as any} 
                  size={18} 
                  color="#4CAF50" 
                />
              </View>
              <ThemedText style={styles.menuItemText}>{item.title}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer with Dark Mode Toggle */}
        <View style={[
          styles.footer,
          { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
        ]}>
          {/* Dark Mode Toggle */}
          <TouchableOpacity 
            style={styles.themeToggle}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <View style={styles.themeToggleContent}>
              <View style={[
                styles.themeIconContainer,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
              ]}>
                <Ionicons 
                  name={isDark ? 'moon' : 'sunny'} 
                  size={18} 
                  color={isDark ? '#FFFFFF' : '#FFC107'} 
                />
              </View>
              <ThemedText style={styles.themeToggleText}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </ThemedText>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: '#E9E9EB',
                true: 'rgba(76, 175, 80, 0.5)',
              }}
              thumbColor={isDark ? '#4CAF50' : '#FFFFFF'}
              ios_backgroundColor="#E9E9EB"
            />
          </TouchableOpacity>
          
          <ThemedText style={styles.footerText}>Finance Tracker v1.0</ThemedText>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appLogo: {
    width: 32,
    height: 32,
    marginRight: 8,
    borderRadius: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 8,
  },
  themeToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  themeToggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default SideDrawer; 