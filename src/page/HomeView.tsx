import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import AskQuestionModal from '../component/AskQuestionModal.tsx';
import {
  addQuestion,
  getThreadList,
  getThread,
  createThread,
} from '../service/apis.tsx';

import {QuestionEntity, ThreadEntity} from '../types.tsx';
import AskQuestionInputText from '../component/AskQuestionInputText.tsx';
import COLORS from '../colors.tsx';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Avatar} from '@rneui/themed';
import AuthContext from '../context/AuthContext';

const HomeView = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [isPending, setIsPending] = useState(false);
  const {currentUser, setCurrentUser} = useContext(AuthContext);

  const onClickAddQuestion = async (content: string | null) => {
    try {
      setIsPending(true);
      const response = await createThread();
      const thread = response.data.data as ThreadEntity;
      // @ts-ignore
      navigation.navigate('ThreadDetail', {
        threadId: thread.id,
        pendingQuestion: content,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  const onClickRequest = () => {
    getThreadList().then(data => {
      console.log(data);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Mistree</Text>
        {currentUser ? (
          <Avatar
            size={32}
            rounded
            title={currentUser?.email?.charAt(0)}
            containerStyle={{
              backgroundColor: COLORS.green,
            }}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('Setting');
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={async () => {
              // @ts-ignore
              navigation.navigate('SignIn');
            }}>
            <Text
              style={{
                color: COLORS.green,
                fontSize: 16,
              }}>
              Sign In
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/*<HeaderView*/}
      {/*  style={{*/}
      {/*    marginTop: 64,*/}
      {/*  }}*/}
      {/*  title={'mist'}*/}
      {/*  leftText={'left'}*/}
      {/*  rightText={'right'}*/}
      {/*  rightImage={require('../assets/clip.png')}*/}
      {/*  onClickLeftButton={() => {}}*/}
      {/*  onClickRightButton={() => {}}*/}
      {/*/>*/}
      <View style={styles.sloganContainer}>
        <Image source={require('../assets/mistree.png')} style={styles.logo} />
        <Text onPress={onClickRequest} style={styles.sloganText}>
          Explore unknown areas
        </Text>
      </View>

      <AskQuestionInputText
        onPress={() => {
          setModalVisible(true);
        }}
      />

      <AskQuestionModal
        modalVisible={modalVisible}
        isPending={isPending}
        onClosed={() => {
          setModalVisible(false);
        }}
        onSend={async (content: string | null) => {
          await onClickAddQuestion(content);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 44,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  header: {
    textAlign: 'left',
    fontSize: 24,
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  sloganContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sloganText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 30,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default HomeView;
