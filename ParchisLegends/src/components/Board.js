import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Tablero de Parchís simplificado.
 */
export default function Board({ children }) {
  return <View style={styles.board}>{children}</View>;
}

const styles = StyleSheet.create({
  board: {
    width: 300,
    height: 300,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#333',
  },
});
