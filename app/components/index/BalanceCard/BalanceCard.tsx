import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { ThemedText } from '@/components/ThemedText';
import { getFinancialData } from '@/services/api';
import { useFinanceStore } from '@/store/useFinanceStore';
import { BalanceCardSkeleton } from '@/app/components/common/Loader/BalanceCardSkeleton';
import { useGetBalance } from '@/services/dashboard/query';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export interface BalanceCardProps {
  showBalance: boolean;
  onToggleBalance: () => void;
  balance?: number;
  isLoading?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ 
  showBalance, 
  onToggleBalance,
  balance: propBalance,
  isLoading: propIsLoading = false
}) => {
  const { data: storeData, setData, setLoading } = useFinanceStore();
  const { data: balanceData, isLoading: isBalanceLoading } = useGetBalance();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Use prop balance if provided, otherwise use API data
  const balance = propBalance !== undefined ? propBalance : balanceData?.data?.balance;
  
  // Determine if loading based on props or API
  const isLoading = propIsLoading || isBalanceLoading;

  const { isLoading: isFinancialDataLoading, data } = useQuery({
    queryKey: ['financialData'],
    queryFn: getFinancialData,
    enabled: true
  });

  useEffect(() => {
    if (data) {
      setData(data);
    }
    setLoading(isFinancialDataLoading);
  }, [data, isFinancialDataLoading, setData, setLoading]);

  if (isLoading || isFinancialDataLoading || !storeData) {
    return <BalanceCardSkeleton />;
  }

  // Use balance from props/API if available, otherwise fallback to store data
  const displayBalance = balance !== undefined ? balance : storeData.totalBalance;

  return (
    <View style={[
      styles.balanceCard,
      { 
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    ]}>
      <View style={styles.balanceHeader}>
        <ThemedText style={styles.balanceLabel}>Total Balance</ThemedText>
        <Pressable onPress={onToggleBalance}>
          <FontAwesome 
            name={showBalance ? "eye" : "eye-slash"} 
            size={20} 
            color={Colors[isDark ? 'dark' : 'light'].tint} 
          />
        </Pressable>
      </View>
      <ThemedText style={styles.balanceAmount}>
        {showBalance ? `$${displayBalance.toFixed(2)}` : '*******'}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  balanceAmount: {
    paddingTop: 10,
    fontSize: 36,
    fontWeight: '700',
    marginTop: 8,
  },
});