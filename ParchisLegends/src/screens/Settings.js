import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

/**
 * Pantalla de ajustes básicos.
 */
export default function Settings() {
  const [music, setMusic] = React.useState(true);
  const [sound, setSound] = React.useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>Música</Text>
        <Switch value={music} onValueChange={setMusic} />
      </View>
      <View style={styles.row}>
        <Text>Sonido</Text>
        <Switch value={sound} onValueChange={setSound} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
});
