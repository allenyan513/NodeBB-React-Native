import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ListRenderItem,
} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import HeaderView from '../component/HeaderView.tsx';
import {Category, Topic} from '../types.tsx';
import SeparatorLine from '../component/SeparatorLine.tsx';
import {useNavigation, useRoute} from '@react-navigation/native';
import CategoryAPI from '../service/categoryAPI.tsx';

interface CreatePostViewProps {}

const CreatePostView: React.FC<CreatePostViewProps> = props => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const route = useRoute();
  const [refreshing, setRefreshing] = React.useState(false);

  const {isPending, isError, error, data} = useQuery({
    queryKey: ['/api/v3/categories'],
    queryFn: async () => {
      const result = await CategoryAPI.getCategories();
      return result.response.categories;
    },
  });

  const renderItem: ListRenderItem<Category> = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('item.cid', item.cid);
          // @ts-ignore
          route.params.onGoBack(item);
          navigation.goBack();
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: item.icon}}
            style={{
              width: 50,
              height: 50,
            }}
          />
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingLeft: 12,
        paddingRight: 12,
      }}>
      <HeaderView
        title={'选择版块'}
        onClickRightButton={() => {}}
        rightText={'Create'}
      />
      <FlatList
        style={{
          padding: 12,
        }}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <SeparatorLine />}
      />
    </View>
  );
};

export default CreatePostView;
