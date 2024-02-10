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
import {useTranslation} from 'react-i18next';

interface AddMediaViewProps {
  style?: StyleProp<ViewStyle>;
  onChanged: (assets: Asset[]) => void;
}

const AddMediaView: React.FC<AddMediaViewProps> = props => {
  const {t} = useTranslation();
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const onClickLaunchPicker = async () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 9}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        //判断如果图片超过9张，就不添加了
        // @ts-ignore
        if (selectedAssets.length + response.assets.length > 9) {
          Alert.alert(t('No more than 9 pictures'));
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
          Alert.alert(t('Do you want to remove this picture?'), '', [
            {
              text: t('Cancel'),
              onPress: () => {},
            },
            {
              text: t('OK'),
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
        {/*<Icon*/}
        {/*  style={{*/}
        {/*    padding: 12,*/}
        {/*    borderWidth: 1,*/}
        {/*    borderRadius: 6,*/}
        {/*    borderColor: 'lightgray',*/}
        {/*  }}*/}
        {/*  name={'camera'}*/}
        {/*  size={24}*/}
        {/*  color={COLORS.primaryTextColor}*/}
        {/*  onPress={() => {}}*/}
        {/*/>*/}
      </View>
      <FlatList
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
