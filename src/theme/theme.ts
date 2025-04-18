import {MyTheme} from '../types/navigation';
import {DarkTheme, DefaultTheme} from '@react-navigation/native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const MyDarkTheme: MyTheme = {
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

export const MyLightTheme: MyTheme = {
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
