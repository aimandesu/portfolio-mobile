import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, ViewStyle} from 'react-native';
import Home from '../../screens/Home/Home';
import React from 'react';
import {getFocusedRouteNameFromRoute, useTheme} from '@react-navigation/native';
import Profile from '../../screens/Home/Profile';

export type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
  Qibla: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator = () => {
  const {colors} = useTheme();

  const tabBarStyle: ViewStyle = {
    backgroundColor: colors.background,
    // borderRadius: 15,
    // height: 60,
    position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: 30,
    // marginHorizontal: 10,
    shadowColor: colors.text,
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    overflow: 'hidden',
  };

  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#66C266',
        tabBarInactiveTintColor: '#999999',
        tabBarIcon: () => null,
        tabBarLabelStyle: {
          color: colors.text,
        },
        tabBarStyle: (route => {
          const routeName = getFocusedRouteNameFromRoute(route);
          const hiddenRoutes = ['MosqueAvailable', 'MosqueDetail'];
          return hiddenRoutes.includes(routeName || '')
            ? {display: 'none'}
            : tabBarStyle;
        })(route),
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          //   tabBarIcon: ({color, size}) => <Text>home</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          //  tabBarIcon: ({color, size}) => <Text>Test</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
