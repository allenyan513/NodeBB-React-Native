import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ListRenderItem,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import {Asset} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';

interface ImagePickPreViewProps {
  assets: Asset[];
  onChange: (assets: Asset[]) => void;
}

const ImagePickPreView: React.FC<ImagePickPreViewProps> = props => {
  const {t} = useTranslation();
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
                const newAssets = props.assets.filter(
                  asset => asset.uri !== item.uri,
                );
                props.onChange(newAssets);
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
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={props.assets}
      horizontal={true}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={() => <View style={{width: 12}} />}
      renderItem={renderItem}
    />
  );
};

export default ImagePickPreView;
