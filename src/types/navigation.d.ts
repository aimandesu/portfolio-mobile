import {Theme} from '@react-navigation/native';

// Define your complete theme interface
interface MyTheme extends Theme {
  colors: {
    background: string;
    text: string;
    primary: string;
    card: string;
    border: string;
    notification: string;
  };
  custom: {
    backgroundContainer: string;
    absoluteWhite: string;
    // other custom properties
  };
}

// Module augmentation
declare module '@react-navigation/native' {
  export interface CustomThemeExtensions {
    custom: {
      backgroundContainer: string;
      absoluteWhite: string;
      // other custom properties
    };
  }

  export interface ExtendedTheme extends Theme, CustomThemeExtensions {}

  export function useTheme(): ExtendedTheme;
}
