import React from 'react';
import { Switch, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: isDark ? '#3A3A3C' : '#E9E9EB',
        true: isDark ? '#0A84FF' : Colors.light.tint,
      }}
      thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
      ios_backgroundColor={isDark ? '#3A3A3C' : '#E9E9EB'}
      style={styles.switch}
    />
  );
};

const styles = StyleSheet.create({
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});

export default ToggleSwitch; 