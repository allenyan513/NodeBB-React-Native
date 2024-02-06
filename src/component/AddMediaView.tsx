import {
  Alert,
  FlatList,
  Image,
  ListRenderItem,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from '../colors.tsx';
import React, {useEffect, useState} from 'react';
import {Asset, launchImageLibrary} from 'react-native-image-picker';

interface AddMediaViewProps {
  style?: StyleProp<ViewStyle>;
  onChanged: (assets: Asset[]) => void;
}

const AddMediaView: React.FC<AddMediaViewProps> = props => {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const onClickLaunchPicker = async () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 9}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        console.log('response', response);
        //判断如果图片超过9张，就不添加了
        // @ts-ignore
        if (selectedAssets.length + response.assets.length > 9) {
          Alert.alert('最多只能选择9张图片');
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

  useEffect(() => {
    props.onChanged(selectedAssets);
  }, [selectedAssets]);

  const renderItem: ListRenderItem<Asset> = ({item}) => {
    return (
      <TouchableOpacity
        onLongPress={() => {
          //remove
          Alert.alert('是否移除这张图片?', '', [
            {
              text: 'Cancel',
              onPress: () => {},
            },
            {
              text: 'Ok',
              onPress: () => {
                setSelectedAssets(prevState => {
                  return prevState.filter(asset => asset.uri !== item.uri);
                });
              },
            },
          ]);
        }}>
        <Image
          source={{uri: item.uri}}
          style={{
            borderRadius: 6,
            borderWidth: 1,
            borderColor: 'lightgray',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 12,
            width: 200,
            height: 200,
            objectFit: 'cover',
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={props.style}>
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 12,
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
      <FlatList
        style={{
        }}
        data={selectedAssets}
        horizontal={true}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{width: 12}} />}
        renderItem={renderItem}
      />
    </View>
  );
};

export default AddMediaView;
