import {
  Text,
  View,
  Button,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { exchangeVerifyToken, getCategories, getThreadList } from "../service/apis.tsx";
import {ThreadEntity} from '../types.tsx';
import {useNavigation} from '@react-navigation/native';
// import useQuery from '../use/useQuery.tsx';
import COLORS from '../colors.tsx';
import React, {useContext, useEffect} from 'react';
import {calculateTime} from '../utils.tsx';
import {QueryClient, useQuery, useQueryClient} from '@tanstack/react-query';
import UnSignInView from '../component/UnSignInView.tsx';
import AuthContext from '../context/AuthContext';

const ThreadListView = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const {isPending, isError, error, data} = useQuery({
    queryKey: ['/api/thread'],
    queryFn: async () => {
      // const response = await getThreadList();
      // return response.data.data as ThreadEntity[];
      const response = await exchangeVerifyToken();
      console.log('response', response.data);
      return [];
    },
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const {currentUser} = useContext(AuthContext);

  const onClickItem = (threadId: string) => {
    console.log('onClickItem', threadId);
    // @ts-ignore
    navigation.navigate('ThreadDetail', {
      threadId: threadId,
    });
  };

  const renderItem: ListRenderItem<ThreadEntity> = ({item}) => {
    const firstQuestion = item.questions[0];
    if (!firstQuestion) {
      return <View />;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          onClickItem(item.id);
        }}>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{firstQuestion.question}</Text>
          <Text numberOfLines={2} style={styles.content}>
            {firstQuestion.answer}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Image
              source={require('../assets/clock999999.png')}
              style={{width: 14, height: 14, marginRight: 4}}
            />
            <Text style={styles.content}>{calculateTime(item.created)}</Text>

            <View
              style={{
                width: 10,
              }}
            />
            <Image
              source={require('../assets/layers999999.png')}
              style={{width: 14, height: 14, marginRight: 4}}
            />
            <Text style={styles.content}>{item.questions.length}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderSeparator = () => <View style={styles.separator} />;
  const renderEmptyComponent = () => (
    <View>
      <Text
        style={{
          flex: 1,
          color: COLORS.primaryTextColor,
          fontSize: 16,
          textAlign: 'center',
          marginTop: 20,
        }}>
        No Thread
      </Text>
    </View>
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['/api/thread'],
    });
    setRefreshing(false);
  };

  return (
    <View style={styles.rootContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 44,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 12,
          paddingBottom: 12,
        }}>
        <Text style={styles.header}>Thread</Text>
        {/*<TouchableOpacity onPress={()=>{*/}
        {/*}}>*/}
        {/*  <Image*/}
        {/*    source={require('../assets/plus.png')}*/}
        {/*    style={{width: 24, height: 24, marginRight: 4}}*/}
        {/*  />*/}
        {/*</TouchableOpacity>*/}
      </View>

      {currentUser == null ? (
        <UnSignInView />
      ) : (
        <View style={styles.rootContainer}>
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
          {/*{isError && (*/}
          {/*  <Text*/}
          {/*    style={{*/}
          {/*      color: 'white',*/}
          {/*      textAlign: 'center',*/}
          {/*      marginTop: 20,*/}
          {/*    }}>*/}
          {/*    Reload*/}
          {/*  </Text>*/}
          {/*)}*/}
          {data && (
            <FlatList
              data={data}
              renderItem={renderItem}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={renderEmptyComponent}
              ItemSeparatorComponent={renderSeparator}
            />
          )}
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
export default ThreadListView;
