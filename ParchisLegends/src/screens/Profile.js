import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Perfil del jugador (datos simulados).
 */
export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>😀</Text>
      <Text>Jugador Invitado</Text>
      <Text>Monedas: 0</Text>
      <Text>Partidas jugadas: 0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    fontSize: 50,
  },
});
