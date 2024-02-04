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

interface ImagePickPreViewProps {
  assets: Asset[];
  onChange: (assets: Asset[]) => void;
}

const ImagePickPreView: React.FC<ImagePickPreViewProps> = props => {
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
      style={{
        padding: 12,
      }}
      data={props.assets}
      horizontal={true}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={() => <View style={{width: 12}} />}
      renderItem={renderItem}
    />
  );
};

export default ImagePickPreView;
