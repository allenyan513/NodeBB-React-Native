import {
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getKnowledgeDetail, updateKnowledge} from '../../service/apis.tsx';
import {KnowledgeEntity, ThreadEntity} from '../../types.tsx';

import {useNavigation, useRoute} from '@react-navigation/native';
import COLORS from '../../colors.tsx';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import HeaderView from '../../component/HeaderView.tsx';
import ReloadView from '../../component/ReloadView.tsx';

const KnowledgeDetailView = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const route = useRoute();
  // @ts-ignore
  const {knowledgeId} = route.params;

  const {isPending, isError, data} = useQuery({
    queryKey: ['/api/knowledge/:knowledgeId', knowledgeId],
    queryFn: async () => {
      const response = await getKnowledgeDetail(knowledgeId);
      if (response.data.code !== 200) {
        throw new Error('Loading Error');
      }
      return response.data.data as KnowledgeEntity;
    },
  });
  const [knowledge, setKnowledge] = useState<KnowledgeEntity | undefined>();

  const mutation = useMutation({
    mutationFn: async (newData: {
      title: string | null;
      content: string | null;
    }) => {
      const response = await updateKnowledge(
        knowledgeId,
        newData.title,
        newData.content,
      );
      return response.data.data as KnowledgeEntity;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['/api/knowledge/:knowledgeId', knowledgeId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/knowledge'],
      });
    },
    onError: (error, variables, context) => {
      // console.log('onError', error, variables, context);
    },
  });

  const onClickSave = () => {
    if (knowledge === undefined) {
      return;
    }
    mutation.mutate({
      title: knowledge.title || null,
      content: knowledge.content || null,
    });
  };

  useEffect(() => {
    setKnowledge(data);
  }, [data]);

  return (
    <View style={styles.rootContainer}>
      <HeaderView
        title={''}
        leftImage={require('../../assets/cross-small.png')}
        rightImage={require('../../assets/save.png')}
        separatorLine={true}
        onClickLeftButton={() => {
          navigation.goBack();
        }}
        onClickRightButton={onClickSave}
      />
      {isPending && (
        <ActivityIndicator
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          size="large"
          color="#ffffff"
        />
      )}
      {isError && (
        <ReloadView errorMessage="Loading Error" onRefresh={() => {}} />
      )}
      {knowledge && (
        <View
          style={{
            flex: 1,
          }}>
          <TextInput
            onChangeText={text => {
              setKnowledge(prevState => {
                if (prevState) {
                  return {
                    ...prevState,
                    title: text,
                  };
                }
                return prevState;
              });
            }}
            multiline={true}
            style={{
              fontSize: 24,
              color: 'white',
              fontWeight: 'bold',
              margin: 15,
            }}>
            {knowledge.title}
          </TextInput>
          <KeyboardAvoidingView
            keyboardVerticalOffset={114}
            style={{flex: 1}}
            behavior={'padding'}>
            <TextInput
              onChangeText={text => {
                setKnowledge(prevState => {
                  if (prevState) {
                    return {
                      ...prevState,
                      content: text,
                    };
                  }
                  return prevState;
                });
              }}
              // ref={contentRef}
              multiline={true}
              style={{
                height: '100%',
                fontSize: 16,
                color: COLORS.primaryTextColor,
                marginLeft: 15,
                marginBottom: 15,
                marginRight: 15,
                lineHeight: 24,
              }}>
              {knowledge.content}
            </TextInput>
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    textAlign: 'left',
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 54,
    marginLeft: 15,
    marginBottom: 15,
  },
  itemContainer: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    color: COLORS.primaryTextColor,
  },
  content: {
    fontSize: 14,
    color: COLORS.secondaryTextColor,
    marginTop: 4,
  },
  separator: {
    height: 1, // 分割线的厚度
    backgroundColor: COLORS.separatorColor, // 分割线的颜色
    marginLeft: 20, // 根据需要调整左边距
    marginRight: 20, // 根据需要调整右边距
  },
});
export default KnowledgeDetailView;
