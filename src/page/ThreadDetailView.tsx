import {
  Text,
  View,
  Button,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  addQuestion,
  createKnowledge,
  getThread,
  updateKnowledge,
} from '../service/apis.tsx';
import {
  KnowledgeEntity,
  QuestionEntity,
  StreamMessage,
  ThreadEntity,
} from '../types.tsx';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import AskQuestionModal from '../component/AskQuestionModal.tsx';
import AskQuestionInputText from '../component/AskQuestionInputText.tsx';
import {useNavigation, useRoute} from '@react-navigation/native';
import COLORS from '../colors.tsx';
import Config from 'react-native-config';
import 'react-native-url-polyfill/auto';
import {callStream} from '../service/apis.tsx';
import HeaderView from '../component/HeaderView.tsx';
import {Skeleton} from '@rneui/base';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import LoadingOverlay from '../component/LoadingOverlay.tsx';
import SourceComponent from '../component/SourceComponent.tsx';

/**
 * threadId为空，question不为空
 * threadId不为空，question为空
 * @constructor
 */
const ThreadDetailView = () => {
  //------------------ use ------------------//
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef<FlatList<QuestionEntity>>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();

  const [isPendingSendQuestion, setIsPendingSendQuestion] = useState(false);
  const [hasSendPendingQuestion, setHasSendPendingQuestion] = useState(false);
  // @ts-ignore
  const {threadId, pendingQuestion} = route.params;

  const {isPending, isError, data} = useQuery({
    queryKey: ['/api/thread/:threadId', threadId],
    // @ts-ignore
    queryFn: async () => {
      const res = await getThread(threadId);
      return res.data.data as ThreadEntity;
    },
  });
  const mutation = useMutation({
    mutationFn: async (_threadId: string) => {
      try {
        const response = await createKnowledge(_threadId);
        return response.data.data as KnowledgeEntity;
      } catch (e) {
        console.error(e);
      }
    },
    onSuccess: (data, variables, context) => {
      console.log('mutation.onSuccess', data);
      // @ts-ignore
      navigation.navigate('KnowledgeDetail', {
        // @ts-ignore
        knowledgeId: data.id,
      });
    },
  });

  const [thread, setThread] = useState<ThreadEntity | undefined>();

  //------------------ function ------------------//
  const requestAddQuestion = async (question: string | null) => {
    flatListRef.current?.scrollToEnd({animated: false});
    //1. 发送添加问题请求，返回问题id
    const response = await addQuestion(threadId, question);
    const thread = response.data.data as ThreadEntity;
    //2. 更新thread
    setThread(thread);
    //3. 根据threadId, questionId, 请求AI，返回的数据结构中带questionId, 动态更新问题的answer
    const url =
      Config.REACT_APP_API_URL +
      `/api/thread/addQuestion/stream?threadId=${thread.id}&question=${question}`;
    const idToken = (await auth().currentUser?.getIdToken()) || '';
    const questions = thread?.questions || [];
    callStream(url, idToken, (message: StreamMessage) => {
      // @ts-ignore
      if (message.type === 'answer') {
        questions[questions.length - 1].answer += message.data;
      } else if (message.type === 'source') {
        questions[questions.length - 1].sources = message.data;
      } else {
        console.log('Unknown message type:', message.type);
      }
      // @ts-ignore
      setThread(pre => {
        return {
          ...pre,
          questions: questions,
        };
      });
      //scroll to bottom
      flatListRef.current?.scrollToEnd({animated: false});
    });
  };

  const createAlertConfirm = () => {
    Alert.alert(
      'Confirm',
      'Are you sure to create a knowledge?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            mutation.mutate(threadId);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderSkeleton = () => {
    return (
      <View>
        <Skeleton
          animation="wave"
          width={'80%'}
          style={{
            marginBottom: 10,
          }}
        />
        <Skeleton
          animation="wave"
          width={'60%'}
          style={{
            marginBottom: 10,
          }}
        />
        <Skeleton
          animation="wave"
          width={'90%'}
          style={{
            marginBottom: 10,
          }}
        />
      </View>
    );
  };

  const renderItem: ListRenderItem<QuestionEntity> = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.question}>{item?.question}</Text>
        {item.answer === null || item.answer === '' ? (
          renderSkeleton()
        ) : (
          <View
            style={{
              marginBottom: 12,
            }}>
            <Text style={styles.answer}>{item?.answer}</Text>
          </View>
        )}
        <View
          style={{
            marginBottom: 12,
          }}>
          <Text style={styles.source}>Source</Text>
          <SourceComponent sources={item?.sources} />
        </View>
        {/*<View*/}
        {/*  style={{*/}
        {/*    marginBottom: 12,*/}
        {/*  }}>*/}
        {/*  <Text style={styles.source}>Relative Questions</Text>*/}
        {/*  /!*<SourceComponent sources={item?.relatedQuestions} />*!/*/}
        {/*</View>*/}
      </View>
    );
  };
  const renderSeparator = () => <View style={styles.separator} />;
  const renderFoot = () => <View style={styles.footer} />;

  //------------------ effect ------------------//
  /**
   * 获取到data后，更新thread
   * 原因是userQuery 没有提供一个手动更新data的接口
   */
  useEffect(() => {
    setThread(data);
    console.log('pendingQuestion', pendingQuestion, hasSendPendingQuestion);
    if (pendingQuestion && !hasSendPendingQuestion) {
      setHasSendPendingQuestion(true);
      requestAddQuestion(pendingQuestion);
    }
  }, [data]);

  //------------------ render ------------------//
  if (isPending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          size="large"
          color="#ffffff"
        />
      </View>
    );
  }
  // if (isError) {
  //   return (
  //     <View>
  //       <Text>Error...</Text>
  //     </View>
  //   );
  // }
  return (
    <View style={styles.container}>
      <HeaderView
        title={'Thread'}
        leftImage={require('../assets/cross-small.png')}
        rightImage={require('../assets/knowledge.png')}
        separatorLine={true}
        onClickLeftButton={() => {
          navigation.goBack();
        }}
        onClickRightButton={createAlertConfirm}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.primary,
        }}>
        <FlatList
          ref={flatListRef}
          data={thread?.questions}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          ListFooterComponent={renderFoot}
        />
        <AskQuestionInputText
          style={styles.askQuestionInputText}
          hint={'Ask follow up...'}
          onPress={() => {
            setModalVisible(true);
          }}
        />
        <AskQuestionModal
          modalVisible={modalVisible}
          isPending={isPendingSendQuestion}
          onClosed={() => {
            setModalVisible(false);
          }}
          onSend={async content => {
            //1. 关闭modal
            setModalVisible(false);
            //2. 新增一个问题，然后动态更新答案
            requestAddQuestion(content);
          }}
        />
      </View>
      <LoadingOverlay isVisible={mutation.isPending} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  askQuestionInputText: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  itemContainer: {
    margin: 16,
  },
  question: {
    fontSize: 28,
    color: COLORS.primaryTextColor,
    marginBottom: 12,
  },
  source: {
    color: COLORS.primaryTextColor,
    fontSize: 22,
    marginBottom: 12,
  },
  answerTitle: {
    color: COLORS.primaryTextColor,
    fontSize: 22,
    marginBottom: 12,
  },
  answer: {
    color: COLORS.primaryTextColor,
    fontSize: 14,
    // marginBottom: 48
  },

  separator: {
    height: 1, // 分割线的厚度
    backgroundColor: COLORS.separatorColor, // 分割线的颜色
  },
  footer: {
    height: 200,
  },
});

export default ThreadDetailView;
