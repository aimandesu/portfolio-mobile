import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useProfileStore} from '../store/store';
import {AuthFormData, authSchema} from '../lib/zod/AuthSchema';
import {useNavigation, useTheme} from '@react-navigation/native';
import {AuthScreenNavigationProp} from '../navigation/AppNavigation';

const LoginSignUp: React.FC = () => {
  const [formType, setFormType] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {login, signup} = useProfileStore();
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const {colors} = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: '',
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      formType: 'login',
    },
  });

  const toggleFormType = () => {
    const newFormType = formType === 'login' ? 'signup' : 'login';
    setFormType(newFormType);
    setValue('formType', newFormType);
    // reset({
    //   username: '',
    //   name: '',
    //   email: '',
    //   password: '',
    //   passwordConfirmation: '',
    //   formType: newFormType,
    // });
    setErrorMessage(null);
  };

  const onSubmit = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      if (formType === 'login') {
        await login(data.email, data.password);
      } else {
        if (data.username && data.passwordConfirmation && data.name) {
          await signup(
            data.username,
            data.name,
            data.email,
            data.password,
            data.passwordConfirmation,
          );
        }
      }
      navigation.navigate('TabNavigator');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Authentication failed',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
      }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
        }}>
        <View
          style={{
            borderRadius: 10,
            padding: 20,
            margin: 20,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 4,
            // elevation: 0.1,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 20,
              textAlign: 'center',
              color: colors.text,
            }}>
            {formType === 'login' ? 'Login' : 'Sign Up'}
          </Text>

          {errorMessage && (
            <View
              style={{
                backgroundColor: '#ffebeb',
                padding: 10,
                borderRadius: 5,
                marginBottom: 15,
              }}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {formType === 'signup' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, {color: colors.text}]}>
                  Username
                </Text>
                <Controller
                  control={control}
                  name="username"
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                      style={[
                        styles.input,
                        errors.username && styles.inputError,
                        {color: colors.text},
                      ]}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value ?? ''}
                      placeholder="Enter username"
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.username && (
                  <Text style={styles.errorText}>
                    {errors.username.message}
                  </Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, {color: colors.text}]}>
                  Full Name
                </Text>
                <Controller
                  control={control}
                  name="name"
                  render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                      style={[
                        styles.input,
                        errors.name && styles.inputError,
                        {color: colors.text},
                      ]}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value ?? ''}
                      placeholder="Enter your name"
                    />
                  )}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.email && styles.inputError,
                    {color: colors.text},
                  ]}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, value, onBlur}}) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.password && styles.inputError,
                    {color: colors.text},
                  ]}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder="Enter password"
                  secureTextEntry
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          {formType === 'signup' && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: colors.text}]}>
                Confirm Password
              </Text>
              <Controller
                control={control}
                name="passwordConfirmation"
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.passwordConfirmation && styles.inputError,
                      {color: colors.text},
                    ]}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder="Confirm password"
                    secureTextEntry
                  />
                )}
              />
              {errors.passwordConfirmation && (
                <Text style={styles.errorText}>
                  {errors.passwordConfirmation.message}
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              formType === 'login' ? styles.loginButton : styles.signupButton,
              isLoading && styles.disabledButton,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {formType === 'login' ? 'Login' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleFormType}
            style={styles.switchFormButton}>
            <Text style={styles.switchFormText}>
              {formType === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },

  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#007aff',
  },
  signupButton: {
    backgroundColor: '#34c759',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchFormButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchFormText: {
    color: '#007aff',
    fontSize: 16,
  },
});

export default LoginSignUp;
