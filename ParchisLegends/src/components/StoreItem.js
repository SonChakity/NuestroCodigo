import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';

/**
 * Item de la tienda.
 */
export default function StoreItem({ item, onBuy }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.price} monedas</Text>
      <CustomButton title="Comprar" onPress={() => onBuy(item)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#bdc3c7',
  },
  title: {
    fontWeight: 'bold',
  },
});
