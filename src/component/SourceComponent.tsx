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
import {Skeleton} from '@rneui/base';
import {useNavigation} from '@react-navigation/native';

interface SourceComponentProps {
  sources: SourceEntity[] | null;
}

const SourceComponent: React.FC<SourceComponentProps> = props => {
  const navigation = useNavigation();
  const onClickItem = (item: SourceEntity) => {
    // @ts-ignore
    navigation.navigate('MyWebView', {
      title: item.title,
      uri: item.url,
    });
  };

  const renderItem = ({item}: {item: SourceEntity}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onClickItem(item);
        }}>
        <View style={styles.itemContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {/*<Text style={styles.content}>{item.url}</Text>*/}
        </View>
      </TouchableOpacity>
    );
  };

  if (props.sources === null) {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Skeleton
          animation="wave"
          width={'80%'}
          style={{
            borderRadius: 10,
            marginRight: 10,
            width: 160,
            height: 80,
          }}
        />
        <Skeleton
          animation="wave"
          width={'60%'}
          style={{
            marginRight: 10,
            borderRadius: 10,
            width: 160,
            height: 80,
          }}
        />
        <Skeleton
          animation="wave"
          width={'90%'}
          style={{
            marginRight: 10,
            borderRadius: 10,
            width: 160,
            height: 80,
          }}
        />
      </View>
    );
  } else {
    return (
      <FlatList
        horizontal={true}
        ItemSeparatorComponent={() => <View style={{width: 10}} />}
        data={props.sources}
        renderItem={renderItem}
      />
    );
  }
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 10,
    width: 160,
    height: 80,
  },
  title: {
    color: COLORS.primaryTextColor,
    fontSize: 14,
  },
  content: {
    color: COLORS.secondaryTextColor,
    fontSize: 12,
  },
});

export default SourceComponent;
