import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, GestureEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

interface SwipeGestureHandlerProps {
  onSwipeRight: () => void;
  children: React.ReactNode;
}

const SwipeGestureHandler: React.FC<SwipeGestureHandlerProps> = ({ 
  onSwipeRight, 
  children 
}) => {
  const EDGE_WIDTH = 40; // Edge width for detection
  
  // On web, we don't need the gesture handler
  if (Platform.OS === 'web') {
    return <>{children}</>;
  }

  // Simple handler without using Reanimated's useAnimatedGestureHandler
  const handleGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    const { translationX, velocityX } = event.nativeEvent;
    
    // If swiped right with enough velocity or distance
    if (velocityX > 200 || translationX > 60) {
      onSwipeRight();
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        activeOffsetX={[-10, 10]} // First value must be negative, second positive
      >
        <Animated.View style={styles.gestureContainer}>
          {children}
          <View 
            style={[
              styles.edgeArea, 
              { width: EDGE_WIDTH }
            ]} 
          />
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gestureContainer: {
    flex: 1,
  },
  edgeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'transparent', // Make it invisible
    zIndex: 1,
  },
});

export default SwipeGestureHandler; 