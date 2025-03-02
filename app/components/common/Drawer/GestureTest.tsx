import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';

interface GestureTestProps {
  onSwipeDetected: () => void;
}

const GestureTest: React.FC<GestureTestProps> = ({ onSwipeDetected }) => {
  const [lastEvent, setLastEvent] = useState<string>('None');
  const [startX, setStartX] = useState(0);

  const handleSwipe = () => {
    setLastEvent('Swipe detected!');
    onSwipeDetected();
  };

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      runOnJS(setStartX)(event.x);
      runOnJS(setLastEvent)(`Begin at x: ${event.x.toFixed(2)}`);
    })
    .onUpdate((event) => {
      runOnJS(setLastEvent)(`Update: dx=${event.translationX.toFixed(2)}, x=${event.x.toFixed(2)}`);
    })
    .onEnd((event) => {
      runOnJS(setLastEvent)(`End: dx=${event.translationX.toFixed(2)}, vx=${event.velocityX.toFixed(2)}`);
      
      // Only trigger if the gesture started near the left edge
      if (startX < 30) {
        // If swiped right with enough velocity or distance
        if (event.velocityX > 200 || event.translationX > 60) {
          runOnJS(handleSwipe)();
        }
      }
    });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.gestureArea}>
          <Text style={styles.instructions}>
            Swipe from left edge to right to test gesture
          </Text>
          <Text style={styles.eventText}>
            Last event: {lastEvent}
          </Text>
        </Animated.View>
      </GestureDetector>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={onSwipeDetected}
      >
        <Text style={styles.buttonText}>
          Test Drawer Open
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gestureArea: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  eventText: {
    fontSize: 14,
    color: 'blue',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GestureTest; 