import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <FontAwesome 
            name="bars" 
            size={24} 
            color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} 
          />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Settings</ThemedText>
      </View>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 85 // Add padding for tab bar height
        }}
      >
        {/* Settings content goes here */}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  menuButton: {
    marginRight: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});