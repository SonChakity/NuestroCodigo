import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Dado básico que muestra el valor actual.
 */
export default function Dice({ value }) {
  return (
    <View style={styles.dice}>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dice: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
