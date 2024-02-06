/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import COLORS from './colors.tsx';
import {AuthProvider, useAuth} from './context/AuthContext.tsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import HomeView from './page/HomeView.tsx';
import SettingView from './page/SettingView.tsx';
import SignInView from './page/SignInView.tsx';
import MyWebView from './page/MyWebView.tsx';
import EmailSignInView from './page/EmailSignInView.tsx';
import TopicDetailView from './page/TopicDetailView.tsx';
import CreatePostView from './page/CreatePostView.tsx';
import SelectCategoryView from './page/SelectCategoryView.tsx';
import NotificationsView from './page/NotificationsView.tsx';
import ReplyPostView from './page/ReplyPostView.tsx';
import {NativeBaseProvider} from 'native-base';
import {GlobalProvider} from './context/GlobalContext.tsx';

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
          tabBarLabel: '首页',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="publish"
        component={HomeView}
        options={{
          tabBarLabel: '发布',
          tabBarIcon: ({color, size}) => (
            <Icon name="pluscircleo" size={24} color={color} />
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
        component={NotificationsView}
        options={{
          tabBarLabel: '通知',
          tabBarIcon: ({color, size}) => (
            <Icon name="message1" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
            name="Home"
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
            name="ReplyPost"
            component={ReplyPostView}
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
  );
}

function App(): React.JSX.Element {
  const queryClient = new QueryClient();

  return (
    <NativeBaseProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <AuthProvider>
            <AppStack />
          </AuthProvider>
        </GlobalProvider>
      </QueryClientProvider>
    </NativeBaseProvider>
  );
}
export default App;
