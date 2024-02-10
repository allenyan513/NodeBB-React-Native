import COLORS from '../colors.tsx';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import VerticalSeparatorLine from './VerticalSeparatorLine.tsx';
import React from 'react';

interface UpDownVoteViewProps {
  voteCount: number;
  onClickUpvote: () => void;
  onClickDownVote: () => void;
}

const UpDownVoteView: React.FC<UpDownVoteViewProps> = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.separatorColor,
        borderRadius: 20,
        marginRight: 10,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: COLORS.third,
      }}>
      <TouchableOpacity onPress={props.onClickUpvote}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon size={20} name={'like2'} />
          <Text
            style={{
              marginLeft: 6,
              marginRight: 8,
              fontSize: 14,
            }}>
            {props.voteCount}
          </Text>
        </View>
      </TouchableOpacity>
      <VerticalSeparatorLine />
      <Icon
        style={{
          marginLeft: 8,
        }}
        onPress={props.onClickDownVote}
        size={20}
        name={'dislike2'}
      />
    </View>
  );
};

export default UpDownVoteView;
