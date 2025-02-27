import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonView } from './SkeletonView';

export const BalanceCardSkeleton = () => {
  return (
    <View style={styles.balanceCard}>
      <View style={styles.balanceHeader}>
        <SkeletonView style={styles.labelSkeleton} />
        <SkeletonView style={styles.iconSkeleton} />
      </View>
      <SkeletonView style={styles.amountSkeleton} />
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 24,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 140, // Match the total height of the actual card
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelSkeleton: {
    width: 100,
    height: 20,
    borderRadius: 4,
  },
  iconSkeleton: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  amountSkeleton: {
    marginTop: 18,
    height: 44,
    width: 200,
    borderRadius: 4,
  },
});