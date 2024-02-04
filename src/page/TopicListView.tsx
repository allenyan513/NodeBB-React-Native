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
import {
  getPopularTopics,
  getRecentTopics,
  getTopics,
} from '../service/apis.tsx';

import {Category, QuestionEntity, ThreadEntity, Topic} from '../types.tsx';
import COLORS from '../colors.tsx';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext.tsx';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/AntDesign';
import TopicItemView from '../component/TopicItemView.tsx';
import SeparatorLine from '../component/SeparatorLine.tsx';

interface TopicListViewProps {
  cid: string;
}

const TopicListView: React.FC<TopicListViewProps> = props => {
  const navigation = useNavigation();
  const {currentUser, setCurrentUser} = useAuth();
  const route = useRoute();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const {isPending, isError, error, data} = useQuery({
    queryKey: ['/api/v3/categories/:cid/topics' + props.cid],
    queryFn: async () => {
      if (props.cid === 'recent') {
        const result = await getRecentTopics();
        return result.response;
      } else if (props.cid === 'popular') {
        const result = await getPopularTopics();
        return result.response;
      } else {
        const result = await getTopics(props.cid);
        return result.response.topics;
      }
    },
  });

  const renderSeparator = () => <SeparatorLine />;
  const renderItem: ListRenderItem<Topic> = ({item}) => {
    return <TopicItemView topic={item} />;
  };
  const onRefresh = async () => {
    console.log('onRefresh');
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['/api/v3/categories/:cid/topics' + props.cid],
    });
    setRefreshing(false);
  };

  return (
    <View style={{}}>
      <FlatList
        data={data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
};

export default TopicListView;
