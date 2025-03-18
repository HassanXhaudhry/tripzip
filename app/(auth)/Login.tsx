import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { setCredentials, setError, setLoading } from '../../store/slices/authSlice';
import { Link } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function Login() {
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(prev => !prev);
  };

  const onSubmit = async (data: FormData) => {
    try {
      dispatch(setLoading(true));
      // Here you would typically make an API call to authenticate the user
      // For demo purposes, we'll simulate a successful login
      const mockResponse = {
        token: 'mock_token',
        user: {
          email: data.email,
        },
      };
      dispatch(setCredentials(mockResponse));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/car5.png')} 
        style={styles.image}
      />
      <Text style={styles.title}>Welcome</Text>

      <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={18} />
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} />
                <TextInput
                  style={styles.inputPassword}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter password"
                  secureTextEntry={isPasswordHidden}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.icon}
                >
                  <Feather
                    name={isPasswordHidden ? "eye-off" : "eye"}
                    size={18}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>
          )}
        />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/(tabs)/Home" asChild>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFB300',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 35,
    backgroundColor: '#FFB300',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 17,
    marginBottom: 8,
    color: '#000000',
    fontWeight: '600'
  },
  input: {
    flex: 1,
    borderRadius: 36,
    paddingLeft: 12,
    fontSize: 14,
    outlineStyle: 'none',
    backgroundColor: '#fff'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 36,
    height: 42,
    backgroundColor: '#fff',
    paddingLeft: 15
  },
  icon: {
    padding: 5,
    position: 'absolute',
    right: 16,
  },
  inputPassword: {
    flex: 1,
    borderRadius: 36,
    paddingLeft: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    outlineStyle: 'none'
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 36,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight:16,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 20,
    alignItems: 'center'
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  footerLink: {
    color: '#000',
    fontWeight: 'bold',
  },
});