import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Tabla de clasificación simulada.
 */
export default function Leaderboard() {
  const top = [
    { id: '1', name: 'Jugador1', wins: 10 },
    { id: '2', name: 'Jugador2', wins: 8 },
  ];
  return (
    <View style={styles.container}>
      {top.map(p => (
        <Text key={p.id}>{p.name} - {p.wins} victorias</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
