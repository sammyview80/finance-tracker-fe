import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface TabSelectorProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map(tab => (
        <Pressable 
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabChange(tab.id)}
        >
          <ThemedText style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
            {tab.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(60, 60, 60, 0.5)',
    borderRadius: 24,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#3700B3',
  },
  tabText: {
    fontWeight: '500',
    fontSize: 16,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});