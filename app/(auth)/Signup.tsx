import React, { useState, useEffect } from 'react';
import { Image, ActivityIndicator } from 'react-native';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { signup, clearError } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Toast from 'react-native-toast-message';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function SignUp() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasAttemptedSignup, setHasAttemptedSignup] = useState(false);

  // Get auth state from Redux store using the typed selector
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      Toast.show({
        type: 'success',
        text1: 'Registration successful!',
        text2: 'Your account has been created successfully!',
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
      router.replace('/Home');
    }
  }, [isAuthenticated, router]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error && hasAttemptedSignup) {
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: error || 'Please check your information and try again',
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
  }, [error, hasAttemptedSignup]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', phone: '', email: '', password: '' },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordHidden((prev) => !prev);
  };

  const onSubmit = async (data: FormData) => {
    console.log('Form Data:', data);
    
    try {
      setHasAttemptedSignup(true);
      const resultAction = await dispatch(
        signup({
          FullName: data.name,
          PhoneNo: data.phone,
          Email: data.email,
          Password: data.password,
        })
      );
      
      if (signup.fulfilled.match(resultAction)) {
        setSuccessMessage('Registration successful!');
        reset(); // Clear form
        
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Your account has been created successfully!',
          position: 'top',
          visibilityTime: 3000,
          topOffset: 40,
          onShow: () => {
            // Wait a moment before navigating to give the toast time to appear
            setTimeout(() => {
              router.push('/(auth)/Login');
            }, 1500);
          },
          props: { 
            style: { 
              borderLeftColor: '#4CAF50', 
              borderLeftWidth: 6 
            } 
          }
        });
      }
    } catch (err) {
      console.error('Signup failed:', err);
      Toast.show({
        type: 'error',
        text1: 'Registration request failed',
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Image source={require('../../assets/images/car4.png')} style={styles.image} />
          <Text style={styles.title}>Create Your Taxican Account</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="user" size={20} color="black" />
                  <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter name"
                    keyboardType="default"
                    placeholderTextColor="#999"
                    autoCorrect={false}
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone No.</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="phone" size={18} />
                  <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter phone number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    autoCorrect={false}
                  />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
              </View>
            )}
          />

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
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
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
                    autoCorrect={false}
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
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/Login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Log in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
      
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
    </KeyboardAvoidingView>
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
    padding: 35,
    justifyContent: 'center',
    backgroundColor: '#FFB300',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
    textAlign: 'center'
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
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 17,
    marginBottom: 6,
    color: '#000000',
    fontWeight: '600'
  },
  input: {
    flex: 1,
    borderRadius: 36,
    paddingLeft: 10,
    fontSize: 14,
    outlineStyle: 'none',
    backgroundColor: '#fff'
  },
  inputPassword: {
    flex: 1,
    borderRadius: 36,
    paddingLeft: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    outlineStyle: 'none'
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    backgroundColor: '#555555',
  },
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