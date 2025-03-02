import React, { useEffect } from 'react';
import { StyleSheet, Animated, ViewStyle, Dimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface SkeletonViewProps {
  style?: ViewStyle;
}

const { width } = Dimensions.get('window');
const GRADIENT_WIDTH = width;
const ANIMATION_DURATION = 1500;

export const SkeletonView: React.FC<SkeletonViewProps> = ({ style }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const animatedValue = new Animated.Value(-GRADIENT_WIDTH);

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: GRADIENT_WIDTH,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: -GRADIENT_WIDTH,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    );
    
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, []);

  const baseColor = isDark ? 'rgba(26, 26, 26, 0.7)' : 'rgba(232, 232, 232, 0.7)';

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.skeleton, { backgroundColor: baseColor }]}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: animatedValue }],
            },
          ]}>
          <LinearGradient
            colors={[
              'transparent',
              isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.8)',
              'transparent',
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  skeleton: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  shimmer: {
    width: GRADIENT_WIDTH,
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    flex: 1,
    width: GRADIENT_WIDTH,
  },
});