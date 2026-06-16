import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export default function OtpInput({
  value,
  onChangeText,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={6}
        value={value}
        onChangeText={onChangeText}
        placeholder="------"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#2F80ED',
    borderRadius: 12,
    height: 60,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 12,
  },
});