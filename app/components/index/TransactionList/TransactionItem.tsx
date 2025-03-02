import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Pressable, Animated, Easing } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { TransactionItemProps } from '@/types/transaction';
import { transactionSharedStyles } from './styles';
import { useRouter } from 'expo-router';
import logger from '@/utils/logger';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

// Define an interface for date objects with year, month, day properties
interface DateLikeObject {
  year?: number;
  month?: number;
  day?: number;
  [key: string]: any;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onLongPress,
  onPress,
}) => {
  const router = useRouter();
  const isIncome = transaction.type === 'income';
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Get category name, handling both string and object formats
  const getCategoryName = () => {
    if (typeof transaction.category === 'string') {
      return transaction.category;
    }
    return transaction.category?.name || 'Uncategorized';
  };
  
  // Format amount, handling both string and number formats
  const getFormattedAmount = () => {
    const amount = typeof transaction.amount === 'string' 
      ? parseFloat(transaction.amount) 
      : transaction.amount;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date, handling all possible formats safely
  const getFormattedDate = () => {
    // If date is a string, return it directly
    if (typeof transaction.date === 'string') {
      try {
        const dateObj = new Date(transaction.date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        }
        return transaction.date;
      } catch {
        return transaction.date;
      }
    }
    
    try {
      // If date is null or undefined, return a placeholder
      if (!transaction.date) {
        return 'No date';
      }
      
      // If date is an empty object, return a placeholder
      if (typeof transaction.date === 'object' && Object.keys(transaction.date).length === 0) {
        return 'No date';
      }
      
      // If date is a timestamp number, convert it
      if (typeof transaction.date === 'number') {
        const dateObj = new Date(transaction.date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        }
      }
      
      // If date is a Date object, use it directly
      if (transaction.date instanceof Date) {
        if (!isNaN(transaction.date.getTime())) {
          return transaction.date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        }
        return 'Invalid date';
      }
      
      // If date is an object with year, month, day properties
      if (typeof transaction.date === 'object') {
        const dateLike = transaction.date as DateLikeObject;
        
        if (dateLike.year) {
          // Create a date from year, month, day
          const dateObj = new Date(
            dateLike.year,
            (dateLike.month || 1) - 1,
            dateLike.day || 1
          );
          
          if (!isNaN(dateObj.getTime())) {
            return dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
          }
        } else {
          // Try to create a date from the object
          const dateObj = new Date(transaction.date as any);
          if (!isNaN(dateObj.getTime())) {
            return dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
          }
        }
      }
      
      // If we got here, the date is invalid
      logger.warn('Invalid date format:', transaction.date);
      return 'Invalid date';
    } catch (error) {
      logger.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  const handlePress = () => {
    if (onPress) {
      onPress(transaction);
    } else {
      router.push(`/transaction/${transaction.id}`);
    }
  };
  
  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
        marginBottom: 12,
      }}
    >
      <Pressable 
        style={({ pressed }) => [
          styles.transactionItem,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
          },
          pressed && styles.transactionItemPressed
        ]}
        onPress={handlePress}
        onLongPress={() => onLongPress && onLongPress(transaction)}
        delayLongPress={300}
        android_ripple={{ color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
      >
        <LinearGradient
          colors={isIncome 
            ? (isDark ? ['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.1)'] : ['rgba(76, 175, 80, 0.15)', 'rgba(76, 175, 80, 0.05)'])
            : (isDark ? ['rgba(255, 82, 82, 0.2)', 'rgba(255, 82, 82, 0.1)'] : ['rgba(255, 82, 82, 0.15)', 'rgba(255, 82, 82, 0.05)'])
          }
          style={styles.transactionIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialCommunityIcons 
            name={isIncome ? 'arrow-up-circle-outline' : 'arrow-down-circle-outline'} 
            size={22} 
            color={isIncome ? (isDark ? '#4CAF50' : '#43A047') : (isDark ? '#FF5252' : '#E53935')} 
          />
        </LinearGradient>
        
        <View style={styles.transactionDetails}>
          <ThemedText style={styles.description} numberOfLines={1} ellipsizeMode="tail">
            {transaction.description}
          </ThemedText>
          <View style={styles.categoryContainer}>
            <Ionicons 
              name="pricetag-outline" 
              size={12} 
              color={isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'} 
              style={styles.categoryIcon}
            />
            <ThemedText style={styles.category} numberOfLines={1} ellipsizeMode="tail">
              {getCategoryName()}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.transactionAmount}>
          <ThemedText style={[
            styles.amount,
            { color: isIncome ? (isDark ? '#4CAF50' : '#43A047') : (isDark ? '#FF5252' : '#E53935') }
          ]}>
            {isIncome ? '+' : '-'}${getFormattedAmount()}
          </ThemedText>
          <View style={styles.dateContainer}>
            <Ionicons 
              name="calendar-outline" 
              size={12} 
              color={isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'} 
              style={styles.dateIcon}
            />
            <ThemedText style={styles.date}>{getFormattedDate()}</ThemedText>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: 4,
  },
  category: {
    fontSize: 14,
    opacity: 0.7,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  transactionItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});