import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';

export default function PartnershipsScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const { showToast } = useToast();
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnershipName, setPartnershipName] = useState('');
  const [partnershipDescription, setPartnershipDescription] = useState('');
  const [shareTransactions, setShareTransactions] = useState(false);
  const [shareBudgets, setShareBudgets] = useState(false);
  const [shareSavingsGoals, setShareSavingsGoals] = useState(false);

  // Reset form
  const resetForm = () => {
    setPartnerEmail('');
    setPartnershipName('');
    setPartnershipDescription('');
    setShareTransactions(false);
    setShareBudgets(false);
    setShareSavingsGoals(false);
  };

  // Handle invite submission
  const handleInvite = () => {
    if (!partnerEmail) {
      showToast('Error', 'Partner email is required');
      return;
    }
    
    if (!partnershipName) {
      showToast('Error', 'Partnership name is required');
      return;
    }
    
    // In a real app, this would send the invitation
    showToast('Success', 'Partnership invitation sent successfully');
    setShowInviteModal(false);
    resetForm();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Partnerships',
          headerRight: () => (
            <Button
              title="Invite"
              onPress={() => setShowInviteModal(true)}
              variant="primary"
              size="small"
              style={styles.inviteButton}
            />
          ),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.infoCard}>
          <Text style={[styles.infoText, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
            Partnerships allow you to share financial information with trusted individuals.
            You can control what information is shared.
          </Text>
        </Card>
        
        <View style={styles.emptyState}>
          <FontAwesome 
            name="users" 
            size={60} 
            color={isDark ? Colors.dark.icon : Colors.light.icon} 
          />
          <Text style={[styles.emptyTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
            No partnerships yet
          </Text>
          <Text style={[styles.emptyText, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
            Invite someone to create a partnership
          </Text>
          <Button
            title="Invite Partner"
            onPress={() => setShowInviteModal(true)}
            variant="primary"
            style={styles.invitePartnerButton}
          />
        </View>
      </ScrollView>
      
      <Modal
        visible={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          resetForm();
        }}
        title="Invite Partner"
      >
        <TextInput
          label="Partner Email"
          placeholder="Enter partner's email"
          value={partnerEmail}
          onChangeText={setPartnerEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          label="Partnership Name"
          placeholder="Enter partnership name"
          value={partnershipName}
          onChangeText={setPartnershipName}
        />
        
        <TextInput
          label="Description (Optional)"
          placeholder="Enter partnership description"
          value={partnershipDescription}
          onChangeText={setPartnershipDescription}
          multiline
          numberOfLines={3}
        />
        
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={() => {
              setShowInviteModal(false);
              resetForm();
            }}
            variant="outline"
            style={styles.cancelButton}
          />
          
          <Button
            title="Send Invitation"
            onPress={handleInvite}
            variant="primary"
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  infoCard: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  inviteButton: {
    marginRight: 10,
  },
  invitePartnerButton: {
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    marginRight: 10,
  },
}); 