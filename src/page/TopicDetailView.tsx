import {
  View,
  FlatList,
  RefreshControl,
  ListRenderItem,
  Text,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {Route, useNavigation, useRoute} from '@react-navigation/native';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import PostItemView from '../component/PostItemView.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import ReplyPostModal from '../component/ReplyPostModal.tsx';
import {Asset} from 'react-native-image-picker';
import AWSHelper from '../service/AWSHepler.tsx';
import TopicAPI from '../service/topicAPI.tsx';
import CurrentAvatarView from '../component/CurrentAvatarView.tsx';
import COLORS from '../colors.tsx';
import {useTranslation} from 'react-i18next';
import {Post, Topic} from '../types.tsx';
import CategoryAPI from '../service/categoryAPI.tsx';
import TopicItemView from '../component/TopicItemView.tsx';
import LoadingMoreView from '../component/LoadingMore.tsx';
import NoMoreDataView from '../component/NoMoreDataView.tsx';

interface TopicDetailViewProps {
  // tid: string;
}

const TopicDetailView: React.FC<TopicDetailViewProps> = props => {
  const {t} = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const tid = route.params.tid;
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [isPendingModal, setIsPendingModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  // @ts-ignore
  const fetchData = async params => {
    const result = await TopicAPI.getTopic(tid, params.pageParam);
    // assign title multiple to first post
    result.posts[0].title = result.title;
    result.posts[0].multimedia = result.multimedia;
    return result;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['/api/v3/topic/:tid', tid],
    queryFn: fetchData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // todo 20是服务端的一个固定值
      if (lastPage.posts.length !== 20) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  const ReplyTextInput = () => {
    return (
      <View
        style={{
          height: 80,
          padding: 8,
          backgroundColor: 'white',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLORS.e5e5e5,
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            // @ts-ignore
            setModalVisible(true);
          }}>
          <View
            style={{
              height: 44,
              backgroundColor: COLORS.e5e5e5,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 10,
              paddingRight: 10,
            }}>
            <Text
              style={{
                color: COLORS.secondaryTextColor,
              }}>
              {t('Add a comment')}
            </Text>
            <View>
              <Icon
                name={'pluscircleo'}
                size={24}
                color={COLORS.secondaryTextColor}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const onReplyTopic = async (content: string, assets: Asset[]) => {
    setIsPendingModal(true);
    try {
      // 上传图片
      const urls = await AWSHelper.uploadAssets(assets);
      // todo 逻辑抽离
      // 将url拼接到content中 markdown格式 ![]()
      let newContent = '';
      urls.forEach(url => {
        newContent += `![${url}](${url})\n`;
      });
      newContent += content;
      // @ts-ignore
      const response = await TopicAPI.replyTopic(tid, newContent, null);
      await queryClient.invalidateQueries({
        queryKey: ['/api/v3/topics/:tid', tid],
      });
      Alert.alert(t('Reply success'));
    } catch (e) {
      console.error(e);
      Alert.alert(t('Reply failed'));
    } finally {
      setIsPendingModal(false);
      setModalVisible(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['/api/v3/topics/:tid', tid],
    });
    setRefreshing(false);
  };

  const renderFooter = () => {
    if (hasNextPage) {
      if (isFetchingNextPage) {
        return <LoadingMoreView />;
      } else {
        return null;
      }
    } else {
      return <NoMoreDataView />;
    }
  };

  const onClickVote = async (action: string, post: Post | undefined) => {
    if (post === undefined) {
      return;
    }
    try {
      if (action === 'upvote') {
        setPosts(prevState => {
          return prevState.map(item => {
            if (item.pid === post.pid) {
              item.votes++;
            }
            return item;
          });
        });
        await TopicAPI.vote(post.pid, 1);
      } else if (action === 'downvote') {
        setPosts(prevState => {
          return prevState.map(item => {
            if (item.pid === post.pid) {
              item.votes--;
            }
            return item;
          });
        });
        await TopicAPI.vote(post.pid, -1);
      } else {
      }
    } catch (e) {
      console.error(e);
      if (action === 'upvote') {
        setPosts(prevState => {
          return prevState.map(item => {
            if (item.pid === post.pid) {
              item.votes--;
            }
            return item;
          });
        });
      } else if (action === 'downvote') {
        setPosts(prevState => {
          return prevState.map(item => {
            if (item.pid === post.pid) {
              item.votes++;
            }
            return item;
          });
        });
      } else {
      }
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => {
        return <CurrentAvatarView />;
      },
    });
  }, []);

  useEffect(() => {
    const posts = data?.pages.map(page => page.posts).flat();
    setPosts(posts || []);
  }, [data]);

  return (
    <View style={{flex: 1}}>
      {/*Topic Header & topic's posts*/}
      <FlatList
        data={posts}
        onEndReached={() => {
          fetchNextPage();
        }}
        onEndReachedThreshold={1}
        renderItem={props => {
          return (
            <PostItemView
              post={props.item}
              index={props.index}
              onClickVote={onClickVote}
            />
          );
        }}
        keyExtractor={item => item.pid.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                height: 8,
                backgroundColor: 'transparent',
              }}
            />
          );
        }}
        ListFooterComponent={renderFooter}
      />
      {/*底部回复输入框*/}
      <ReplyTextInput />
      {/*回复弹窗*/}
      <ReplyPostModal
        modalVisible={modalVisible}
        isPending={isPendingModal}
        onClosed={() => {
          setModalVisible(false);
        }}
        onSend={(content, assets) => {
          onReplyTopic(content, assets);
        }}
      />
    </View>
  );
};

export default TopicDetailView;
