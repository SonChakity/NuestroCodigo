import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';

/**
 * Ventana modal genérica.
 */
export default function ModalWindow({ visible, children }) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    minWidth: '80%',
  },
});
