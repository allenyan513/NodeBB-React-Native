import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal} from 'react-native';
import COLORS from "../colors.tsx";

interface LoadingOverlayProps {
  isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = props => {
  if (!props.isVisible) {
    return null;
  }

  return (
    <Modal transparent={true} animationType="none" visible={props.isVisible}>
      <View style={styles.overlay}>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: COLORS.third,
            borderRadius: 10,
          }}>
          <ActivityIndicator
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default LoadingOverlay;
