// usePreventNavigation.ts
import {useNavigation} from '@react-navigation/native';
import {usePreventRemove} from '@react-navigation/native';
import {Alert, Platform} from 'react-native';
import React from 'react';

type PreventNavigationOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export const usePreventNavigation = (
  hasUnsavedChanges: boolean,
  customMessage?: PreventNavigationOptions,
) => {
  const navigation = useNavigation();

  usePreventRemove(hasUnsavedChanges, ({data}) => {
    if (!hasUnsavedChanges) {
      navigation.dispatch(data.action);
      return;
    }

    const defaultMessages: PreventNavigationOptions = {
      title: 'Discard changes?',
      description:
        'You have unsaved changes. Discard them and leave the screen?',
      confirmText: 'Discard',
      cancelText: "Don't leave",
    };

    const messages = {
      ...defaultMessages,
      ...customMessage,
    };

    Alert.alert(messages.title!, messages.description!, [
      {
        text: messages.cancelText!,
        style: 'cancel',
      },
      {
        text: messages.confirmText!,
        style: 'destructive',
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });
};
