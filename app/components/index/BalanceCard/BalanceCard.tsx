import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { ThemedText } from '@/components/ThemedText';
import { getFinancialData } from '@/services/api';
import { useFinanceStore } from '@/store/useFinanceStore';
import { BalanceCardSkeleton } from '@/app/components/common/Loader/BalanceCardSkeleton';

interface BalanceCardProps {
  showBalance: boolean;
  onToggleBalance: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ 
  showBalance, 
  onToggleBalance 
}) => {
  const { data: storeData, setData, setLoading } = useFinanceStore();
  
  const { isLoading, data } = useQuery({
    queryKey: ['financialData'],
    queryFn: getFinancialData,
    enabled: true
  });

  useEffect(() => {
    if (data) {
      setData(data);
    }
    setLoading(isLoading);
  }, [data, isLoading, setData, setLoading]);
  console.log(isLoading);

  if (isLoading || !storeData) {
    return <BalanceCardSkeleton />;
  }

  return (
    <View style={styles.balanceCard}>
      <View style={styles.balanceHeader}>
        <ThemedText style={styles.balanceLabel}>Total Balance</ThemedText>
        <Pressable onPress={onToggleBalance}>
          <FontAwesome name={showBalance ? "eye" : "eye-slash"} size={20} color="#4CAF50" />
        </Pressable>
      </View>
      <ThemedText style={styles.balanceAmount}>
        {showBalance ? `$${storeData.totalBalance.toFixed(2)}` : '*******'}
      </ThemedText>
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
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  balanceAmount: {
    paddingTop: 10,
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
});