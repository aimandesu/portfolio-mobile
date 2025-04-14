import {View, Text, useColorScheme} from 'react-native';
import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home/Home';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LoginSignUp from '../screens/LoginSignUp';
import {useProfileStore} from '../store/store';
import Profile from '../screens/Home/Profile';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const AuthStack = createNativeStackNavigator<RootStackParamList>();
export type AuthScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type RootStackParamList = {
  Home: undefined;
  LoginSignUp: undefined;
  Profile: undefined;
};

const AppNavigation = () => {
  const {profile} = useProfileStore();

  const isDarkMode = useColorScheme() === 'dark';

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.darker,
      text: Colors.white,
    },
  };

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.lighter,
      text: Colors.black,
    },
  };

  return (
    <NavigationContainer theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
      <AuthStack.Navigator>
        <>
          {profile == null ? (
            <AuthStack.Screen
              name="LoginSignUp"
              component={LoginSignUp}
              options={{headerShown: false}}
            />
          ) : (
            <AuthStack.Screen
              name="Home"
              component={Home}
              options={{headerShown: false}}
            />
          )}
          <AuthStack.Screen
            name="Profile"
            component={Profile}
            options={{headerShown: false}}
          />
        </>
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
