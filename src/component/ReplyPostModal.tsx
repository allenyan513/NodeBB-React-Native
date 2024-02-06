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
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import COLORS from '../colors.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import ImagePickPreView from './ImagePickPreView.tsx';

interface ReplyPostModalProps {
  modalVisible: boolean;
  isPending: boolean;
  onClosed: () => void;
  onSend: (content: string, assets: Asset[]) => void;
}

const ReplyPostModal: React.FC<ReplyPostModalProps> = props => {
  const [textInputValue, setTextInputValue] = useState<string>('');
  const textInputRef = useRef<TextInput>(null);
  const isSendButtonDisabled = textInputValue.length === 0;

  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const onClickLaunchPicker = async () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 3}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        console.log('response', response);
        // @ts-ignore
        if (selectedAssets.length + response.assets.length > 3) {
          Alert.alert('回复最多只能选3张图片');
          return;
        }
        // @ts-ignore
        setSelectedAssets(prevState => {
          // @ts-ignore
          return [...prevState, ...response.assets];
        });
      }
    });
  };

  const onClickSend = () => {
    if (isSendButtonDisabled) {
      return;
    }
    props.onSend(textInputValue, selectedAssets);
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
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Icon
                  style={{
                    padding: 12,
                    borderWidth: 1,
                    borderColor: 'lightgray',
                    borderRadius: 6,
                    marginRight: 12,
                  }}
                  name={'picture'}
                  size={24}
                  color={COLORS.primaryTextColor}
                  onPress={onClickLaunchPicker}
                />
                <Icon
                  style={{
                    padding: 12,
                    borderWidth: 1,
                    borderRadius: 6,
                    borderColor: 'lightgray',
                  }}
                  name={'camera'}
                  size={24}
                  color={COLORS.primaryTextColor}
                  onPress={() => {}}
                />
              </View>

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
            <ImagePickPreView
              assets={selectedAssets}
              onChange={assets => {
                setSelectedAssets(assets);
              }}
            />
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
    borderWidth: 1,
    borderColor: COLORS.separatorColor,
    alignItems: 'flex-start',

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
    marginBottom: 12,
    marginTop: 20,
  },
});

export default ReplyPostModal;
