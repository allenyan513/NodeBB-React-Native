import {Image, Text, useWindowDimensions, View} from 'react-native';
import {Post, Topic} from '../types.tsx';
import React from 'react';
import RenderHTML from 'react-native-render-html';
import {AspectRatio} from 'native-base';
import COLORS from '../colors.tsx';
import AvatarUserNameAndTimeView from './AvatarUserNameAndTimeView.tsx';
import UpDownVoteView from './UpDownVoteView.tsx';
import PagerView from 'react-native-pager-view';

interface PostItemProps {
  index: number;
  post: Post;
  onClickVote: (action: string, post: Post) => void;
}

/**
 * 帖子列表项
 * @param post
 * @constructor
 */
const PostItemView: React.FC<PostItemProps> = ({index, post, onClickVote}) => {
  const width = useWindowDimensions().width;
  const isFirst = index === 0;

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
          <PagerView initialPage={0} orientation={'horizontal'}>
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
          onClickUpvote={() => {
            onClickVote('upvote', post);
          }}
          onClickDownVote={() => {
            onClickVote('downvote', post);
          }}
        />
      </View>
    </View>
  );
};

export default PostItemView;
