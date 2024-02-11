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
import {extendTheme, NativeBaseProvider} from 'native-base';
import {useTranslation} from 'react-i18next';
import {GlobalProvider} from './context/GlobalContext.tsx';
import './i18n.js';
import TopicListView from './page/TopicListView.tsx';
import fcmService from './service/fcmService.tsx';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  const {t} = useTranslation();
  const {currentUser, checkSignIn} = useAuth();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopColor: COLORS.separatorColor,
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: COLORS.secondaryTextColor,
      }}>
      <Tab.Screen
        name="HomeView"
        component={HomeView}
        options={{
          tabBarLabel: t('Home'),
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="publish"
        component={HomeView}
        options={{
          tabBarLabel: t('Publish'),
          tabBarIcon: ({color, size}) => (
            <Icon name="pluscircleo" size={24} color={color} />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            if (checkSignIn()) {
              navigation.navigate('CreatePost');
            }
          },
        })}
      />
      <Tab.Screen
        name="Thread"
        component={NotificationsView}
        options={{
          tabBarLabel: t('Notification'),
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
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name=" "
          component={HomeTabs}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name={'TopicDetail'} component={TopicDetailView} />
        <Stack.Screen name={'TopicList'} component={TopicListView} />
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
  );
}

function App(): React.JSX.Element {
  const queryClient = new QueryClient();
  const theme = extendTheme({
    colors: {
      // Add new color
      primary: {
        50: '#E3F2F9',
        100: '#C5E4F3',
        200: '#A2D4EC',
        300: '#7AC1E4',
        400: '#47A9DA',
        500: '#0088CC',
        600: '#007AB8',
        700: '#006BA1',
        800: '#005885',
        900: '#003F5E',
      },
      // Redefining only one shade, rest of the color will remain same.
      amber: {
        400: '#d97706',
      },
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: 'dark',
    },
  });

  useEffect(() => {
    fcmService.getDeviceToken();
    fcmService.requestUserPermission();
    const unsubscribe = fcmService.onMessage();
    return unsubscribe;
  }, []);

  return (
    <NativeBaseProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <GlobalProvider>
            <AuthProvider>
              <AppStack />
            </AuthProvider>
          </GlobalProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </NativeBaseProvider>
  );
}
export default App;
