import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export default function PasswordInput({
  value,
  onChangeText,
}: Props) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry={hidden}
        value={value}
        onChangeText={onChangeText}
      />

      <TouchableOpacity
        onPress={() => setHidden(!hidden)}
      >
        <Ionicons
          name={
            hidden
              ? 'eye-off-outline'
              : 'eye-outline'
          }
          size={22}
          color="#6B7280"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
  },
});