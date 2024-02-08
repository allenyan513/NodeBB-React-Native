import {Image, Text, useWindowDimensions, View} from 'react-native';
import {Post, Topic} from '../types.tsx';
import React from 'react';
import RenderHTML from 'react-native-render-html';
import {AspectRatio, Avatar} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from '../colors.tsx';
import {calculateTime} from '../utils.tsx';
import AvatarUserNameAndTimeView from './AvatarUserNameAndTimeView.tsx';
import {SafeAreaView} from 'react-native-safe-area-context';
import UpDownVoteView from './UpDownVoteView.tsx';
import PagerView from 'react-native-pager-view';

interface PostItemProps {
  index: number;
  post: Post;
}

/**
 * 帖子列表项
 * @param post
 * @constructor
 */
const PostItemView: React.FC<PostItemProps> = ({index, post}) => {
  const width = useWindowDimensions().width;
  const isFirst = index === 0;
  const isOdd = index % 2 === 0;
  const onClickUpvote = () => {};
  const onClickDownVote = () => {};

  const hasMultiMedia = post?.multimedia?.images?.length > 0;

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: COLORS.ffffff,
      }}>
      {/*用户头像 & 用户昵称 & 发布时间*/}
      <AvatarUserNameAndTimeView
        avatar={post?.user?.picture}
        username={post?.user.username}
        timestamp={post?.timestamp}
      />
      {isFirst && (
        <Text
          style={{
            fontSize: 18,
            paddingTop: 8,
            paddingBottom: 8,
          }}>
          {post?.title}
        </Text>
      )}
      {isFirst && hasMultiMedia && (
        <AspectRatio
          ratio={{
            base: 1 / 1,
            md: 1 / 1,
          }}
          width={'100%'}>
          <PagerView
            initialPage={0} orientation={'horizontal'}>
            {post?.multimedia?.images?.map((image, index) => {
              return (
                <Image
                  key={index}
                  source={{uri: image}}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                  }}
                />
              );
            })}
          </PagerView>
        </AspectRatio>
      )}

      <RenderHTML contentWidth={width} source={{html: post.content}} />
      {/*toolbar*/}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <UpDownVoteView
          voteCount={post?.votes || 0}
          onClickUpvote={onClickUpvote}
          onClickDownVote={onClickDownVote}
        />
      </View>
    </View>
  );
};

export default PostItemView;
