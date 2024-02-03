/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

import {
  Button,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import COLORS from './colors.tsx';
import AuthContext from './context/AuthContext.js';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import HomeView from './page/HomeView.tsx';
import ThreadListView from './page/lengcy/ThreadListView.tsx';
import SettingView from './page/SettingView.tsx';
import SignInView from './page/SignInView.tsx';
import ThreadDetailView from './page/lengcy/ThreadDetailView.tsx';
import KnowledgeListView from './page/lengcy/KnowledgeListView.tsx';
import KnowledgeDetailView from './page/lengcy/KnowledgeDetailView.tsx';
import MyWebView from './page/MyWebView.tsx';
import EmailSignInView from './page/EmailSignInView.tsx';
import DebugView from './page/DebugView.tsx';
import TopicListView from './page/TopicListView.tsx';
import TopicDetailView from './page/TopicDetailView.tsx';
import CreatePostView from './page/CreatePostView.tsx';
import SelectCategoryView from "./page/SelectCategoryView.tsx";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopColor: COLORS.primary,
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeView}
        options={{
          tabBarLabel: '议事厅',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="publish"
        component={KnowledgeListView}
        options={{
          tabBarLabel: '发布',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('CreatePost');
          },
        })}
      />
      <Tab.Screen
        name="Thread"
        component={DebugView}
        options={{
          tabBarLabel: '通知',
          tabBarIcon: ({color, size}) => (
            <Icon name="message1" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Knowledge"
        component={KnowledgeListView}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({color, size}) => (
            <Icon name="user" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  const [isAuthAlready, setIsAuthAlready] = useState(false);
  const [currentUser, setCurrentUser] =
    useState<FirebaseAuthTypes.User | null>();
  const queryClient = new QueryClient();

  useEffect(() => {
    if (isAuthAlready) {
      return;
    }
    const subscriber = auth().onAuthStateChanged(userState => {
      // console.log('onAuthStateChanged', userState);
      setCurrentUser(userState);
      setIsAuthAlready(true);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          currentUser,
          setCurrentUser,
        }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Group>
              <Stack.Screen
                name="Mistree"
                component={HomeTabs}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen name={'TopicDetail'} component={TopicDetailView} />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'modal'}}>
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name="CreatePost"
                component={CreatePostView}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name="SelectCategory"
                component={SelectCategoryView}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name={'Setting'}
                component={SettingView}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name={'SignIn'}
                component={SignInView}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name={'MyWebView'}
                component={MyWebView}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name={'EmailSignIn'}
                component={EmailSignInView}
              />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
export default App;
