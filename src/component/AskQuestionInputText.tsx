import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useContext, useRef, useState} from 'react';
import COLORS from '../colors.tsx';
import AuthContext from '../context/AuthContext';
import {useNavigation} from '@react-navigation/native';

interface AskQuestionInputTextProps {
  style?: any;
  hint?: string;
  onPress: () => void;
}

const AskQuestionInputText: React.FC<AskQuestionInputTextProps> = props => {
  const {currentUser} = useContext(AuthContext);
  const navigation = useNavigation();
  const onClickInput = () => {
    if (!currentUser) {
      // @ts-ignore
      navigation.navigate('SignIn');
    } else {
      props.onPress();
    }
  };
  return (
    <View style={props.style}>
      <TouchableOpacity activeOpacity={0.8} onPress={onClickInput}>
        <View style={styles.searchBarContainer}>
          <Text style={styles.searchBar}>
            {props.hint ? props.hint : 'Ask anything...'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
    height: 50,
  },
  clip: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  voice: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    padding: 10,
  },
});

export default AskQuestionInputText;
