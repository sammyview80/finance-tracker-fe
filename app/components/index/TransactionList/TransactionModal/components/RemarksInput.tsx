import React from 'react';
import { TextInput } from 'react-native';
import { styles } from '../styles';

interface RemarksInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const RemarksInput: React.FC<RemarksInputProps> = ({
  value,
  onChange
}) => {
  return (
    <TextInput
      style={[styles.input, styles.remarksInput]}
      value={value}
      onChangeText={onChange}
      placeholder="Add remarks"
      placeholderTextColor="#666"
      multiline
    />
  );
};