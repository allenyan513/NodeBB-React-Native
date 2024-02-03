import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import AskQuestionModal from '../component/AskQuestionModal.tsx';
import {
  addQuestion,
  getThreadList,
  getThread,
  createThread,
  exchangeVerifyToken,
  getCategories,
} from '../service/apis.tsx';

import {Category, QuestionEntity, ThreadEntity} from '../types.tsx';
import AskQuestionInputText from '../component/AskQuestionInputText.tsx';
import COLORS from '../colors.tsx';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Avatar} from '@rneui/themed';
import AuthContext from '../context/AuthContext.js';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {calculateTime} from '../utils.tsx';
import {styled} from 'nativewind';
import HeaderView from '../component/HeaderView.tsx';
import PagerView from 'react-native-pager-view';
import TopicListView from './TopicListView.tsx';

const StyledView = styled(View);
const StyledText = styled(Text);

const HomeView = () => {
  const navigation = useNavigation();
  const {currentUser, setCurrentUser} = useContext(AuthContext);

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const {isPending, isError, error, data} = useQuery({
    queryKey: ['/api/v3/categories'],
    queryFn: async () => {
      const result = await getCategories();
      return result.response.categories;
    },
  });

  const renderItem: ListRenderItem<Category> = ({item}) => {
    console.log('renderItem', item.cid);
    return (
      <TouchableOpacity
        onPress={() => {
          // @ts-ignore
          navigation.navigate('TopicList', {
            cid: item.cid,
          });
        }}>
        <View
          style={{
            padding: 20,
            backgroundColor: 'red',
            margin: 10,
            borderRadius: 10,
          }}>
          <Text>{item.cid}</Text>
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['/api/v3/categories'],
    });
    setRefreshing(false);
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <HeaderView
        title={'Home'}
        style={{
          marginTop: 44,
        }}
      />
      <PagerView style={{flex: 1}} initialPage={0}>
        <View key={'0'}>
          <TopicListView cid={'recent'} />
        </View>
        <View key={'1'}>
          <TopicListView cid={'popular'} />
        </View>
        <TopicListView cid={'1'} />
      </PagerView>
    </View>
  );
};

export default HomeView;
