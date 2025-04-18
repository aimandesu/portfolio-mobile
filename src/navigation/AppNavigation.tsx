import {Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import React from 'react';
import {NavigationContainer, useTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LoginSignUp from '../screens/LoginSignUp';
import {useProfileStore} from '../store/store';

import TabNavigator from './NavigationType/TabBar';
import {MyDarkTheme, MyLightTheme} from '../theme/theme';
import EditProfile from '../screens/Profile/Edit/EditProfile';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark';
import {ProfileClass} from '../lib/zod/UserSchema';

export type RootStackParamList = {
  Home: undefined;
  LoginSignUp: undefined;
  EditProfile: {
    userId: string;
    profile: ProfileClass;
    onSave?: (profile: ProfileClass) => void;
  };
};

//to use for like navigation
export type AuthScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

//creating the type of stack wanted
const AuthStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const {profile} = useProfileStore();

  const isDarkMode = useColorScheme() === 'dark';

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
          <AuthStack.Screen
            name="EditProfile"
            component={EditProfile}
            options={({navigation, route}) => {
              // const {userId, profile, onSave} = route.params;

              return {
                headerShown: true,
                title: 'Edit Status',
                headerLeft: () => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: 10,
                    }}
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    <FontAwesomeIcon icon={faXmark} color={'white'} />
                    <View style={{width: 10}} />
                  </TouchableOpacity>
                ),
                // headerRight: () => (
                //   <TouchableOpacity
                //     style={{}}
                //     onPress={() => {
                //       onSave?.(profile);
                //       navigation.goBack();
                //     }}>
                //     <Text style={{marginLeft: 5, fontSize: 16, color: 'white'}}>
                //       Save
                //     </Text>
                //   </TouchableOpacity>
                // ),
              };
            }}
          />
        </>
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
