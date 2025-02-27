import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { SavingsGoal } from '@/store/useBudgetStore';

interface SavingsGoalsViewProps {
  goals: SavingsGoal[];
  onAddGoal?: () => void;
}

export const SavingsGoalsView: React.FC<SavingsGoalsViewProps> = ({ goals, onAddGoal }) => {
  return (
    <View>
      {goals.map((goal) => {
        const progressPercent = (goal.saved / goal.target) * 100;
        return (
          <View key={goal.id} style={styles.goalContainer}>
            <View style={styles.goalHeaderRow}>
              <ThemedText style={styles.goalTitle}>{goal.category}</ThemedText>
              <ThemedText style={styles.goalAmount}>
                ${goal.saved.toFixed(0)} / ${goal.target.toFixed(0)}
              </ThemedText>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progressPercent}%` }
                  ]} 
                />
              </View>
              <ThemedText style={styles.progressText}>
                {progressPercent.toFixed(0)}% Complete
              </ThemedText>
            </View>
            
            <ThemedText style={styles.goalRemaining}>
              ${goal.remaining.toFixed(0)} to go
            </ThemedText>
          </View>
        );
      })}

      {onAddGoal && (
        <TouchableOpacity style={styles.addGoalButton} onPress={onAddGoal}>
          <FontAwesome name="plus" size={16} color="#FFF" />
          <ThemedText style={styles.addGoalText}>Add New Goal</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  goalContainer: {
    marginBottom: 20,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalAmount: {
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBackground: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'right',
  },
  goalRemaining: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  addGoalButton: {
    flexDirection: 'row',
    backgroundColor: '#3700B3',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addGoalText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});