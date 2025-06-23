import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import StoreItem from '../components/StoreItem';

/**
 * Pantalla de tienda con monedas simuladas.
 */
export default function Store() {
  const [items] = useState([
    { id: '1', name: 'Skin Roja', price: 100 },
    { id: '2', name: 'Tablero Azul', price: 200 },
  ]);

  const buyItem = (item) => {
    console.log('Comprar', item);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <StoreItem item={item} onBuy={buyItem} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
