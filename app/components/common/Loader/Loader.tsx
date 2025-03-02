import React, { useEffect } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function Loader() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const rotateValue = new Animated.Value(0);
  const opacityValue = new Animated.Value(0.4);

  useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 0.8,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 0.4,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loaderContainer,
          {
            opacity: opacityValue,
            transform: [{ rotate }],
          },
        ]}>
        <LinearGradient
          colors={isDark ? ['#2A2A2A', '#1A1A1A'] : ['#F5F5F5', '#E1E9EE']}
          style={styles.loader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  loader: {
    width: '100%',
    height: '100%',
  },
});