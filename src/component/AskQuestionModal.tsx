import {
  View,
  Button,
  StyleSheet,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import COLORS from '../colors.tsx';

interface AskQuestionModalProps {
  modalVisible: boolean;
  isPending: boolean;
  onClosed: () => void;
  onSend: (value: string | null) => void;
}

const AskQuestionModal: React.FC<AskQuestionModalProps> = props => {
  const [textInputValue, setTextInputValue] = useState<string>('');
  const textInputRef = useRef<TextInput>(null);
  const isSendButtonDisabled = textInputValue.length === 0;
  const onClickSend = () => {
    if (isSendButtonDisabled) {
      return;
    }
    props.onSend(textInputValue);
  };

  useEffect(() => {
    if (props.modalVisible) {
      setTimeout(() => {
        textInputRef?.current?.focus();
      }, 100);
    }
  }, [props.modalVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.onClosed();
        // props.setModalVisible(!props.modalVisible);
      }}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={props.onClosed} // 点击外部区域关闭Modal
      >
        <KeyboardAvoidingView
          behavior="position"
          style={styles.keyboardAvoidingView}>
          <View style={styles.container} onStartShouldSetResponder={() => true}>
            <TextInput
              placeholder="Ask anything..."
              placeholderTextColor={'#666'}
              ref={textInputRef}
              value={textInputValue}
              onChangeText={value => setTextInputValue(value)}
              multiline={true}
              numberOfLines={1}
              returnKeyType={'send'}
              onKeyPress={e => {
                if (e.nativeEvent.key === 'Enter') {
                  onClickSend();
                }
              }}
              style={styles.textInput}
            />
            <View style={styles.toolBar}>
              <TouchableOpacity />
              {props.isPending ? (
                <ActivityIndicator
                  style={{
                    width: 25,
                    height: 25,
                  }}
                  color={COLORS.green}
                />
              ) : (
                <TouchableOpacity onPress={onClickSend}>
                  <Image
                    style={{width: 25, height: 25}}
                    tintColor={
                      isSendButtonDisabled
                        ? COLORS.secondaryTextColor
                        : COLORS.green
                    }
                    source={require('../assets/send.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.secondary,
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  textInput: {
    width: '100%',
    color: COLORS.primaryTextColor,
    fontSize: 18,
  },
  toolBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
});

export default AskQuestionModal;
