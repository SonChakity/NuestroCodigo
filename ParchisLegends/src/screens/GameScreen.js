import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Board from '../components/Board';
import Piece from '../components/Piece';
import Dice from '../components/Dice';
import CustomButton from '../components/CustomButton';
import ChatBubble from '../components/ChatBubble';

/**
 * Pantalla principal de juego (simplificada).
 */
export default function GameScreen() {
  const [dice, setDice] = useState(1);
  const [messages, setMessages] = useState([]);

  const rollDice = () => {
    const value = Math.floor(Math.random() * 6) + 1;
    setDice(value);
    setMessages([...messages, { id: Date.now().toString(), text: `Tirada: ${value}` }]);
  };

  return (
    <View style={styles.container}>
      <Board>
        <Piece color="red" />
      </Board>
      <Dice value={dice} />
      <CustomButton title="Tirar" onPress={rollDice} />
      {messages.map(m => (
        <ChatBubble key={m.id} author="Sistema" message={m.text} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
});
