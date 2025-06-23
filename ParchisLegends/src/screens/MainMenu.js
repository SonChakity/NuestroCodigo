import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';

/**
 * Menú principal con navegación.
 */
export default function MainMenu({ navigation }) {
  return (
    <View style={styles.container}>
      <CustomButton title="Jugar Online" onPress={() => navigation.navigate('GameLobby')} />
      <CustomButton title="Jugar Local" onPress={() => navigation.navigate('Game')} />
      <CustomButton title="Tienda" onPress={() => navigation.navigate('Store')} />
      <CustomButton title="Clasificación" onPress={() => navigation.navigate('Leaderboard')} />
      <CustomButton title="Perfil" onPress={() => navigation.navigate('Profile')} />
      <CustomButton title="Ajustes" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
