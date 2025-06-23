import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import { createRoom, joinRoom, subscribeRooms } from '../services/api';
import ModalWindow from '../components/ModalWindow';

/**
 * Lobby online con salas simuladas.
 */
export default function GameLobby({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  subscribeRooms(setRooms);

  return (
    <View style={styles.container}>
      <CustomButton title="Crear partida" onPress={() => {
        const id = createRoom();
        joinRoom(id);
        navigation.navigate('Game');
      }} />
      <FlatList
        data={rooms}
        keyExtractor={r => r.id}
        renderItem={({ item }) => (
          <CustomButton title={`Unirse a sala ${item.id}`} onPress={() => {
            joinRoom(item.id);
            navigation.navigate('Game');
          }} />
        )}
      />
      <ModalWindow visible={modalVisible}>
        {/* Contenido extra para futuros usos */}
        <CustomButton title="Cerrar" onPress={() => setModalVisible(false)} />
      </ModalWindow>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
