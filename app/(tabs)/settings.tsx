import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert, Linking, Share } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { SettingsItem, SettingsSection, ToggleSwitch } from '@/app/components/common/Settings';
import { showSuccess } from '@/utils/toast';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { currentTheme, theme, setTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const insets = useSafeAreaInsets();
  const { logout, user } = useAuth();
  
  // State for toggle settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);

  // Update dark mode toggle when theme changes
  useEffect(() => {
    setDarkModeEnabled(isDark);
  }, [isDark]);

  // Handle dark mode toggle
  const handleDarkModeToggle = (value: boolean) => {
    setDarkModeEnabled(value);
    setTheme(value ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace('/onboarding/auth');
          }
        }
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing finance tracker app!',
        url: 'https://finance-tracker.app',
        title: 'Finance Tracker App'
      });
      showSuccess('Thanks for sharing!');
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const handleRateApp = () => {
    // This would typically open the app store page
    Linking.openURL('https://finance-tracker.app/rate');
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@finance-tracker.app');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://finance-tracker.app/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://finance-tracker.app/terms');
  };

  // Helper function to navigate safely
  const navigateTo = (path: string) => {
    try {
      router.push(path as any);
    } catch (error) {
      console.error(`Navigation error to ${path}:`, error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 85, // Add padding for tab bar height
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={[
            styles.profileAvatar,
            { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(10, 126, 164, 0.1)' }
          ]}>
            <Ionicons 
              name="person" 
              size={40} 
              color={isDark ? Colors.dark.tint : Colors.light.tint} 
            />
          </View>
          <View style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>{user?.name || 'User'}</ThemedText>
            <ThemedText style={styles.profileEmail}>{user?.email || 'user@example.com'}</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => navigateTo('/profile/edit')}
          >
            <ThemedText style={styles.editProfileText}>Edit</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <SettingsItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Receive alerts and reminders"
            rightComponent={
              <ToggleSwitch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            }
            showChevron={false}
          />
          <SettingsItem
            icon="finger-print-outline"
            title="Biometric Authentication"
            subtitle="Secure your app with biometrics"
            rightComponent={
              <ToggleSwitch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
              />
            }
            showChevron={false}
          />
          <SettingsItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            rightComponent={
              <ToggleSwitch
                value={darkModeEnabled}
                onValueChange={handleDarkModeToggle}
              />
            }
            showChevron={false}
          />
          <SettingsItem
            icon="language-outline"
            title="Language"
            subtitle="English (US)"
            onPress={() => navigateTo('/settings/language')}
          />
          <SettingsItem
            icon="cash-outline"
            title="Currency"
            subtitle="USD ($)"
            onPress={() => navigateTo('/settings/currency')}
          />
        </SettingsSection>

        {/* Data & Sync Section */}
        <SettingsSection title="Data & Sync">
          <SettingsItem
            icon="cloud-upload-outline"
            title="Backup Data"
            subtitle="Last backup: Today, 10:30 AM"
            onPress={() => navigateTo('/settings/backup')}
          />
          <SettingsItem
            icon="cloud-download-outline"
            title="Restore Data"
            subtitle="Restore from cloud or local backup"
            onPress={() => navigateTo('/settings/restore')}
          />
          <SettingsItem
            icon="sync-outline"
            title="Sync Frequency"
            subtitle="Automatic"
            onPress={() => navigateTo('/settings/sync')}
          />
        </SettingsSection>

        {/* Support & Feedback Section */}
        <SettingsSection title="Support & Feedback">
          <SettingsItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => navigateTo('/settings/help')}
          />
          <SettingsItem
            icon="mail-outline"
            title="Contact Support"
            onPress={handleContactSupport}
          />
          <SettingsItem
            icon="star-outline"
            title="Rate the App"
            onPress={handleRateApp}
          />
          <SettingsItem
            icon="share-social-outline"
            title="Share the App"
            onPress={handleShareApp}
          />
        </SettingsSection>

        {/* Legal Section */}
        <SettingsSection title="Legal">
          <SettingsItem
            icon="document-text-outline"
            title="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <SettingsItem
            icon="document-outline"
            title="Terms of Service"
            onPress={handleTermsOfService}
          />
          <SettingsItem
            icon="information-circle-outline"
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => navigateTo('/settings/about')}
          />
        </SettingsSection>

        {/* Logout Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="log-out-outline"
            title="Logout"
            destructive
            onPress={handleLogout}
          />
        </SettingsSection>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  menuButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  editProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  editProfileText: {
    color: Colors.light.tint,
    fontWeight: '500',
  },
});