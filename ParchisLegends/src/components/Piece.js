import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Ficha de juego.
 */
export default function Piece({ color }) {
  return <View style={[styles.piece, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  piece: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
