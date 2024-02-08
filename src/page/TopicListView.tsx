import {View, FlatList, RefreshControl, ListRenderItem} from 'react-native';
import React, {useReducer} from 'react';

import {Topic, TopicAction, TopicState} from '../types.tsx';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import TopicItemView from '../component/TopicItemView.tsx';
import SeparatorLine from '../component/SeparatorLine.tsx';
import TopicAPI from '../service/topicAPI.tsx';
import CategoryAPI from '../service/categoryAPI.tsx';
import {useGlobalState} from '../context/GlobalContext.tsx';

interface TopicListViewProps {
  cid: string | number;
}

const TopicListView: React.FC<TopicListViewProps> = props => {
  const navigation = useNavigation();
  const route = useRoute();

  const {globalState, dispatch} = useGlobalState();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const {isPending, isError, error, data} = useQuery({
    queryKey: ['/api/v3/categories/:cid/topics' + props.cid],
    queryFn: async () => {
      let topics: Topic[] = [];
      if (props.cid === 'recent') {
        const result = await TopicAPI.getRecentTopics();
        topics = result.response;
      } else if (props.cid === 'popular') {
        const result = await TopicAPI.getPopularTopics();
        topics = result.response;
      } else {
        const result = await CategoryAPI.getTopics(props.cid);
        topics = result.response.topics;
      }
      //过滤已经被删除的帖子
      topics = topics.filter(item => {
        return !item.deleted;
      });

      dispatch({
        type: 'SET_TOPICS',
        payload: {
          cid: props.cid,
          topics: topics,
        },
      });
      return topics;
    },
  });

  const renderSeparator = () => <SeparatorLine />;
  const renderItem: ListRenderItem<Topic> = props => {
    return (
      <TopicItemView
        index={props.index}
        topic={props.item}
      />
    );
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
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <FlatList
        data={globalState.topicsMap.get(props.cid)}
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
