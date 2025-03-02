import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  RefreshControl, 
  ActivityIndicator, 
  Animated, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/ThemedText';
import { TransactionListProps, Transaction } from '@/types/transaction';
import { TransactionItem } from './TransactionItem';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { useTheme } from '@/contexts/ThemeContext';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  showHeader = false,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  onEndReached,
  hasMoreData = false,
  onTransactionEdit,
  onScroll
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  const handleLongPress = (transaction: Transaction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const closeAllSwipeables = (exceptId?: string) => {
    swipeableRefs.current.forEach((ref, id) => {
      if (id !== exceptId && ref) {
        ref.close();
      }
    });
  };

  const renderRightActions = (transaction: Transaction, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    
    const opacity = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActionsContainer}>
        <Animated.View style={[styles.actionContainer, { opacity, transform: [{ scale }] }]}>
          <LinearGradient
            colors={isDark ? ['#3700B3', '#5C00E6'] : ['#5C00E6', '#3700B3']}
            style={styles.actionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setSelectedTransaction(transaction);
                setModalVisible(true);
                closeAllSwipeables(transaction.id);
              }}
            >
              <View style={styles.actionContent}>
                <Ionicons name="pencil" size={22} color="#FFFFFF" />
                <ThemedText style={styles.actionText}>Edit</ThemedText>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View style={[styles.actionContainer, { opacity, transform: [{ scale }] }]}>
          <LinearGradient
            colors={isDark ? ['#D32F2F', '#B71C1C'] : ['#F44336', '#D32F2F']}
            style={styles.actionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                // Handle delete action
                closeAllSwipeables(transaction.id);
              }}
            >
              <View style={styles.actionContent}>
                <Ionicons name="trash" size={22} color="#FFFFFF" />
                <ThemedText style={styles.actionText}>Delete</ThemedText>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasMoreData) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#4CAF50" />
        <ThemedText style={styles.footerText}>Loading more transactions...</ThemedText>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>No transactions found</ThemedText>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
    return (
      <Animated.View
        style={{
          transform: [{ 
            scale: new Animated.Value(1) 
          }],
          opacity: new Animated.Value(1)
        }}
      >
        <Swipeable
          ref={(ref) => {
            if (ref && item.id) {
              swipeableRefs.current.set(item.id, ref);
            }
          }}
          renderRightActions={(progress, dragX) => renderRightActions(item, dragX)}
          onSwipeableOpen={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            closeAllSwipeables(item.id);
          }}
          overshootRight={false}
          friction={2}
          rightThreshold={40}
        >
          <TransactionItem 
            transaction={item} 
            onLongPress={() => handleLongPress(item)}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedTransaction(item);
              setModalVisible(true);
            }}
          />
        </Swipeable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>All Transactions</ThemedText>
        </View>
      )}
      
      <Animated.FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || `${item.amount}-${item.date}-${Math.random()}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? "#FFFFFF" : "#3700B3"}
            colors={["#3700B3", "#4CAF50"]}
          />
        }
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      <TransactionDetailsModal
        transaction={selectedTransaction}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onEdit={onTransactionEdit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Extra padding for FAB
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  rightActionsContainer: {
    width: 160,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionContainer: {
    width: 80,
    height: '86%',
    marginVertical: '3.5%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});