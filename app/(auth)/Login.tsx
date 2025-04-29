import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { AppDispatch } from '../../store/store';
import { login } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      Toast.show({
        type: 'success',
        text1: 'Login successful!',
        text2: 'Welcome back to the app',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 40,
        props: { 
          style: { 
            borderLeftColor: '#4CAF50', 
            borderLeftWidth: 6 
          } 
        }
      });
      router.push('/(tabs)/Home'); 
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error && hasAttemptedLogin) {
      const formattedError = error?.toLowerCase().includes('invalid username') 
        ? error.replace('username', 'email') 
        : error;
        
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: formattedError || 'Please check your credentials and try again',
        position: 'top',
        visibilityTime: 4000,
        topOffset: 40,
        props: { 
          style: { 
            borderLeftColor: '#FF5252', 
            borderLeftWidth: 6,
          } 
        }
      });
    }
  }, [error, hasAttemptedLogin]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPasswordHidden((prev) => !prev);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setHasAttemptedLogin(true);
      await dispatch(login({ Email: data.email, Password: data.password }));
    } catch (error) {
      console.error('Login request error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login request failed',
        text2: 'Network error or server issue. Please try again.',
        position: 'top',
        topOffset: 40,
        props: { 
          style: { 
            borderLeftColor: '#FF5252', 
            borderLeftWidth: 6,
          } 
        }
      });
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Image source={require('../../assets/images/car5.png')} style={styles.image} />
          <Text style={styles.title}>Welcome</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={18} />
                  <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
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
                    placeholderTextColor="#999"
                    secureTextEntry={isPasswordHidden}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                    <Feather name={isPasswordHidden ? 'eye-off' : 'eye'} size={18} />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>
            )}
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSubmit(onSubmit)} 
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging In...' : 'Login'}
            </Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/Signup" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Register</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
      
      {/* Toast component configuration */}
      <Toast config={{
        success: ({ text1, text2, props }) => (
          <View style={[styles.toastContainer, styles.successToast, props?.style]}>
            <Feather name="check-circle" size={24} color="#4CAF50" />
            <View style={styles.toastTextContainer}>
              <Text style={styles.toastTitle}>{text1}</Text>
              <Text style={styles.toastMessage}>{text2}</Text>
            </View>
          </View>
        ),
        error: ({ text1, text2, props }) => (
          <View style={[styles.toastContainer, styles.errorToast, props?.style]}>
            <Feather name="alert-circle" size={24} color="#FF5252" />
            <View style={styles.toastTextContainer}>
              <Text style={styles.toastTitle}>{text1}</Text>
              <Text style={styles.toastMessage}>{text2}</Text>
            </View>
          </View>
        ),
      }} />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFB300',
    fontFamily: 'PlusJakartaSans-Bold',
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
    paddingRight: 16,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: '#555555',
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
  // Toast styles
  toastContainer: {
    width: '90%',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  successToast: {
    backgroundColor: '#FFFFFF',
  },
  errorToast: {
    backgroundColor: '#FFFFFF',
  },
  toastTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  toastTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000',
  },
  toastMessage: {
    fontSize: 14,
    color: '#555555'
  },
});