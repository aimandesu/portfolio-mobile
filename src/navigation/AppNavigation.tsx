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
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabNavigator from './NavigationType/NavigationType';
import {MyTheme} from '../types/navigation';

//type use
type DrawerParamList = {
  Home: undefined;
  Profile: undefined;
};

type RootStackParamList = {
  Home: undefined;
  LoginSignUp: undefined;
  Profile: undefined;
};

//to use for like navigation
export type AuthScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

//creating the type of stack wanted
const AuthStack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'front',
        headerShown: false,
      }}
      // drawerContent={(props) => {
      //   const routeName = props.state.routeNames[props.state.index];
      //   return routeName === 'Profile'
      //     ? <ProfileDrawerContent {...props} />
      //     : <HomeDrawerContent {...props} />;
      // }}
    >
      {/* <Drawer.Screen name="Home" component={Home} /> */}
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
};

const AppNavigation = () => {
  const {profile} = useProfileStore();

  const isDarkMode = useColorScheme() === 'dark';

  const MyDarkTheme: MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.darker,
      text: Colors.white,
    },
    custom: {
      backgroundContainer: '#605d5c',
      absoluteWhite: Colors.white,
    },
  };

  const MyLightTheme: MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.lighter,
      text: Colors.black,
    },
    custom: {
      backgroundContainer: '#242424',
      absoluteWhite: Colors.white,
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
              component={TabNavigator}
              options={{headerShown: false}}
            />
          )}
          {/* <AuthStack.Screen
            name="Profile"
            component={Profile}
            options={{headerShown: false}}
          /> */}
        </>
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
