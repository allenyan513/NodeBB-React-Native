import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {Category, Topic} from '../types.tsx';
import SeparatorLine from '../component/SeparatorLine.tsx';
import {useNavigation, useRoute} from '@react-navigation/native';
import CategoryAPI from '../service/categoryAPI.tsx';
import HeaderView from '../component/HeaderView.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTranslation} from 'react-i18next';

interface CreatePostViewProps {}

const CreatePostView: React.FC<CreatePostViewProps> = props => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

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
            height: 50,
          }}>
          <Text
            style={{
              marginLeft: 24,
            }}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <HeaderView
        leftButton={
          <Icon
            name={'close'}
            size={24}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
        title={t('Select Category')}
      />
      <FlatList
        style={{}}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <SeparatorLine />}
      />
    </View>
  );
};

export default CreatePostView;
