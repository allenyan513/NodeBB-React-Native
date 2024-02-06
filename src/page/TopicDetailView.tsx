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
import {useQuery, useQueryClient} from '@tanstack/react-query';
import TopicItemView from '../component/TopicItemView.tsx';
import SeparatorLine from '../component/SeparatorLine.tsx';
import PostItemView from '../component/PostItemView.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import ReplyPostModal from '../component/ReplyPostModal.tsx';
import {Asset} from 'react-native-image-picker';
import AWSHelper from '../service/AWSHepler.tsx';
import TopicAPI from '../service/topicAPI.tsx';
import CurrentAvatarView from '../component/CurrentAvatarView.tsx';
import COLORS from '../colors.tsx';

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

  const [modalVisible, setModalVisible] = useState(false);
  const [isPendingModal, setIsPendingModal] = useState(false);

  const {isPending, isError, error, data} = useQuery({
    queryKey: ['/api/v3/topic/:tid', tid],
    queryFn: async () => {
      const result = await TopicAPI.getTopic(tid);
      return result;
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
              Add a comment
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
      Alert.alert('Reply success');
    } catch (e) {
      console.error(e);
      Alert.alert('Reply failed');
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

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => {
        return <CurrentAvatarView />;
      },
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      {/*Topic Header & topic's posts*/}
      <FlatList
        data={data?.posts}
        renderItem={props => {
          return <PostItemView post={props.item} index={props.index} />;
        }}
        ListHeaderComponent={() => {
          return (
            <TopicItemView index={0} topic={data} isShowInPostList={true} />
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
