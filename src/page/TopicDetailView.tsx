import {View, FlatList, RefreshControl, ListRenderItem} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {getTopic} from '../service/apis.tsx';

import {Post} from '../types.tsx';
import {Route, useNavigation, useRoute} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import TopicItemView from '../component/TopicItemView.tsx';
import SeparatorLine from '../component/SeparatorLine.tsx';
import PostItemView from '../component/PostItemView.tsx';

interface TopicDetailViewProps {
  // tid: string;
}

const TopicDetailView: React.FC<TopicDetailViewProps> = props => {
  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const tid = route.params.tid;
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const {isPending, isError, error, data} = useQuery({
    queryKey: ['/api/v3/topic/:tid', tid],
    queryFn: async () => {
      const result = await getTopic(tid);
      return result;
    },
  });

  const renderSeparator = () => <SeparatorLine />;
  const renderHeader = () => <TopicItemView topic={data} />;
  const renderItem: ListRenderItem<Post> = ({item}) => {
    return <PostItemView post={item} />;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['/api/v3/topics/:tid', tid],
    });
    setRefreshing(false);
  };

  return (
    <View style={{}}>
      <FlatList
        data={data?.posts}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
};

export default TopicDetailView;
