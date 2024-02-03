import {
  Text,
  View,
  Button,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {getKnowledgeList, getThreadList} from '../../service/apis.tsx';
import {KnowledgeEntity, ThreadEntity} from '../../types.tsx';

import {useNavigation} from '@react-navigation/native';
import COLORS from '../../colors.tsx';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import ReloadView from '../../component/ReloadView.tsx';
import UnSignInView from '../../component/UnSignInView.tsx';
import AuthContext from '../../context/AuthContext.js';

const KnowledgeListView = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const {currentUser} = useContext(AuthContext);
  const {isPending, isError, error, data} = useQuery({
    queryKey: ['/api/knowledge'],
    queryFn: async () => {
      const response = await getKnowledgeList();
      const knowledge = response.data.data as KnowledgeEntity[];
      if (knowledge.length > 0) {
        return knowledge;
      } else {
        return null;
      }
    },
  });
  console.log('KnowledgeList. isError', isError, error);

  const onClickItem = (knowledgeId: string) => {
    // @ts-ignore
    navigation.navigate('KnowledgeDetail', {
      knowledgeId: knowledgeId,
    });
  };

  const renderItem: ListRenderItem<KnowledgeEntity> = ({item}) => {
    if (!item) {
      return <View />;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          onClickItem(item.id);
        }}>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.content}>
            {item.content}
          </Text>
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
        No Knowledge
      </Text>
    </View>
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['/api/knowledge'],
    });
    setRefreshing(false);
  };

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.header}>Knowledge</Text>
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
          {/*  <ReloadView errorMessage="Loading Error" onRefresh={onRefresh} />*/}
          {/*)}*/}
          {data?.length === 0 ? (
            <UnSignInView />
          ) : (
            <FlatList
              data={data}
              renderItem={renderItem}
              ItemSeparatorComponent={renderSeparator}
              ListEmptyComponent={renderEmptyComponent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
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
    marginTop: 44,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 12,
    paddingBottom: 12,
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
export default KnowledgeListView;
