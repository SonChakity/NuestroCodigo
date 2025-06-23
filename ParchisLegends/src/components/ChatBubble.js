import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Mensaje de chat.
 */
export default function ChatBubble({ message, author }) {
  return (
    <View style={styles.container}>
      <Text style={styles.author}>{author}:</Text>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1',
    padding: 8,
    borderRadius: 4,
    marginVertical: 2,
  },
  author: {
    fontWeight: 'bold',
  },
});
