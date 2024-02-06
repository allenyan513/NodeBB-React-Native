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
import React, {useReducer} from 'react';

import {Topic, TopicAction, TopicState} from '../types.tsx';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import TopicItemView from '../component/TopicItemView.tsx';
import SeparatorLine from '../component/SeparatorLine.tsx';
import TopicAPI from '../service/topicAPI.tsx';
import CategoryAPI from '../service/categoryAPI.tsx';

interface TopicListViewProps {
  cid: string | number;
}

const TopicListView: React.FC<TopicListViewProps> = props => {
  const navigation = useNavigation();
  const route = useRoute();

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
      dispatch({type: 'SET_TOPICS', payload: topics});
      return topics;
    },
  });

  const initialTopicState: TopicState = {
    topics: [],
  };

  const topicReducer = (state: TopicState, action: TopicAction): TopicState => {
    console.log('topicReducer', action.type);
    switch (action.type) {
      case 'SET_TOPICS':
        return {
          ...state,
          topics: action.payload,
        };
      case 'UPVOTE':
      case 'DOWNVOTE':
        const {tid, delta} = action.payload;
        return {
          ...state,
          topics: state.topics.map(topic => {
            if (topic.tid === tid) {
              return {...topic, upvotes: topic.upvotes + delta};
            }
            return topic;
          }),
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(topicReducer, initialTopicState);

  const renderSeparator = () => <SeparatorLine />;
  const renderItem: ListRenderItem<Topic> = props => {
    return (
      <TopicItemView
        index={props.index}
        topic={props.item}
        dispatch={dispatch}
        isShowInPostList={false}
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
    <View style={{}}>
      <FlatList
        data={state.topics}
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
