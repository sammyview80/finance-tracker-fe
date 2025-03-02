import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/contexts/ThemeContext';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Transaction, Category } from '@/types/transaction';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface TransactionAnalyticsProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
}

interface CategoryData {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

// Helper function to get category name
const getCategoryName = (category: Category | string | undefined): string => {
  if (!category) return 'Uncategorized';
  if (typeof category === 'string') return category;
  return category.name || 'Uncategorized';
};

export const TransactionAnalytics: React.FC<TransactionAnalyticsProps> = ({
  transactions,
  totalIncome,
  totalExpenses,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  // Calculate monthly data (last 6 months)
  const getMonthlyData = () => {
    const today = new Date();
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      // Filter transactions for this month
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date as string);
        return tDate.getMonth() === month.getMonth() && tDate.getFullYear() === month.getFullYear();
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
        
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      monthlyData.push({
        month: monthName,
        income,
        expense,
      });
    }
    
    return monthlyData;
  };

  // Colors for charts
  const chartColors = [
    '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722', '#607D8B'
  ];

  // Calculate category breakdown
  const getCategoryBreakdown = () => {
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const categoryName = getCategoryName(t.category);
        
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = 0;
        }
        expensesByCategory[categoryName] += Number(t.amount);
      });
    
    // Convert to array and sort by amount
    const categoryData = Object.entries(expensesByCategory)
      .map(([name, amount]) => ({ name, amount: Number(amount) }))
      .sort((a, b) => b.amount - a.amount);
    
    // Limit to top 5 categories
    const topCategories = categoryData.slice(0, 5);
    
    // Add "Other" category if needed
    if (categoryData.length > 5) {
      const otherAmount = categoryData
        .slice(5)
        .reduce((sum, cat) => sum + cat.amount, 0);
      
      topCategories.push({ name: 'Other', amount: otherAmount });
    }
    
    // Format for PieChart
    return topCategories.map((category, index) => ({
      name: category.name,
      amount: category.amount,
      color: chartColors[index % chartColors.length],
      legendFontColor: isDark ? '#FFFFFF' : '#000000',
      legendFontSize: 12
    }));
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryBreakdown();
  
  // Format data for line chart
  const lineChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        data: monthlyData.map(d => d.income),
        color: () => isDark ? 'rgba(76, 175, 80, 0.8)' : 'rgba(76, 175, 80, 0.7)',
        strokeWidth: 2,
      },
      {
        data: monthlyData.map(d => d.expense),
        color: () => isDark ? 'rgba(244, 67, 54, 0.8)' : 'rgba(244, 67, 54, 0.7)',
        strokeWidth: 2,
      },
    ],
    legend: ['Income', 'Expenses'],
  };

  // Calculate balance and savings rate
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Income vs Expenses Summary */}
      <View style={styles.summaryContainer}>
        <LinearGradient
          colors={isDark ? ['#1E1E1E', '#2C2C2C'] : ['#F5F5F5', '#FFFFFF']}
          style={styles.summaryCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.summaryHeader}>
            <ThemedText style={styles.summaryTitle}>Financial Summary</ThemedText>
            <View style={styles.periodBadge}>
              <ThemedText style={styles.periodText}>Last 30 Days</ThemedText>
            </View>
          </View>
          
          <View style={styles.metricsContainer}>
            {/* Balance */}
            <View style={styles.metricItem}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? '#2C2C2C' : '#F0F0F0' }]}>
                <MaterialCommunityIcons 
                  name="wallet-outline" 
                  size={20} 
                  color={isDark ? '#FFFFFF' : '#333333'} 
                />
              </View>
              <View>
                <ThemedText style={styles.metricLabel}>Balance</ThemedText>
                <ThemedText style={[
                  styles.metricValue, 
                  { color: balance >= 0 ? '#4CAF50' : '#F44336' }
                ]}>
                  ${Math.abs(balance).toLocaleString()}
                </ThemedText>
              </View>
            </View>
            
            {/* Savings Rate */}
            <View style={styles.metricItem}>
              <View style={[styles.iconContainer, { backgroundColor: isDark ? '#2C2C2C' : '#F0F0F0' }]}>
                <MaterialCommunityIcons 
                  name="piggy-bank-outline" 
                  size={20} 
                  color={isDark ? '#FFFFFF' : '#333333'} 
                />
              </View>
              <View>
                <ThemedText style={styles.metricLabel}>Savings Rate</ThemedText>
                <ThemedText style={[
                  styles.metricValue, 
                  { color: savingsRate >= 0 ? '#4CAF50' : '#F44336' }
                ]}>
                  {savingsRate.toFixed(1)}%
                </ThemedText>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Monthly Trends Chart */}
      <View style={styles.chartContainer}>
        <ThemedText style={styles.chartTitle}>Monthly Trends</ThemedText>
        <View style={styles.chartWrapper}>
          {monthlyData.length > 0 ? (
            <LineChart
              data={lineChartData}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                backgroundGradientFrom: isDark ? '#1E1E1E' : '#FFFFFF',
                backgroundGradientTo: isDark ? '#2C2C2C' : '#F5F5F5',
                decimalPlaces: 0,
                color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                },
                propsForLabels: {
                  fontSize: 10,
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              yAxisLabel="$"
              yAxisSuffix=""
              yAxisInterval={1}
              fromZero
              segments={4}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons 
                name="bar-chart-outline" 
                size={40} 
                color={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 
              />
              <ThemedText style={styles.noDataText}>
                Not enough data to display chart
              </ThemedText>
            </View>
          )}
        </View>
      </View>

      {/* Spending by Category */}
      <View style={styles.chartContainer}>
        <ThemedText style={styles.chartTitle}>Spending by Category</ThemedText>
        <View style={styles.chartWrapper}>
          {categoryData.length > 0 ? (
            <View>
              <PieChart
                data={categoryData}
                width={width - 40}
                height={220}
                chartConfig={{
                  backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                  backgroundGradientFrom: isDark ? '#1E1E1E' : '#FFFFFF',
                  backgroundGradientTo: isDark ? '#2C2C2C' : '#F5F5F5',
                  decimalPlaces: 0,
                  color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForLabels: {
                    fontSize: 10,
                  },
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend={true}
                center={[width / 4, 0]}
              />
              
              {/* Additional details table */}
              <View style={styles.categoryDetailsContainer}>
                {categoryData.map((category, index) => (
                  <View key={index} style={styles.categoryDetailRow}>
                    <View style={styles.categoryColorAndName}>
                      <View 
                        style={[
                          styles.categoryColor, 
                          { backgroundColor: category.color }
                        ]} 
                      />
                      <ThemedText style={styles.categoryName}>
                        {category.name}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.categoryAmount}>
                      ${category.amount.toLocaleString()}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons 
                name="pie-chart-outline" 
                size={40} 
                color={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 
              />
              <ThemedText style={styles.noDataText}>
                No expense data to display
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryContainer: {
    marginVertical: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  periodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(98, 0, 238, 0.1)',
  },
  periodText: {
    fontSize: 12,
    color: '#6200EE',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chartWrapper: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noDataContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    marginTop: 8,
    opacity: 0.6,
  },
  categoryDetailsContainer: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  categoryDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  categoryColorAndName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 