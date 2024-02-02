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
import AuthContext from './context/AuthContext';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import HomeView from './page/HomeView.tsx';
import ThreadListView from './page/ThreadListView.tsx';
import SettingView from './page/SettingView.tsx';
import SignInView from './page/SignInView.tsx';
import ThreadDetailView from './page/ThreadDetailView.tsx';
import KnowledgeListView from './page/KnowledgeListView.tsx';
import KnowledgeDetailView from './page/KnowledgeDetailView.tsx';
import MyWebView from './page/MyWebView.tsx';
import EmailSignInView from './page/EmailSignInView.tsx';

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
        name="Thread"
        component={ThreadListView}
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
      console.log('onAuthStateChanged', userState);
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
            <Stack.Group screenOptions={{presentation: 'modal'}}>
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name="ThreadDetail"
                component={ThreadDetailView}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name="KnowledgeDetail"
                component={KnowledgeDetailView}
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
