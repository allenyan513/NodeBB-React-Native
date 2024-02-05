import {
  View,
  Button,
  StyleSheet,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import COLORS from '../colors.tsx';
import {SourceEntity} from '../types.tsx';

interface SourceComponentProps {
  errorMessage?: string;
  onRefresh?: () => void;
}

const ReloadView: React.FC<SourceComponentProps> = props => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: COLORS.primaryTextColor,
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 20,
        }}>
        {props.errorMessage}
      </Text>
      <Button
        color={COLORS.primaryTextColor}
        title={'Reload'}
        onPress={props.onRefresh}
      />
    </View>
  );
};
export default ReloadView;
