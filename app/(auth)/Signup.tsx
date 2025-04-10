import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { signup } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '../../store/store';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function SignUp() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
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
      await dispatch(
        signup({
          Name: data.name,
          Phone: data.phone,
          Email: data.email,
          Password: data.password,
        })
      );
      router.push('/Login'); 
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };
  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Image source={require('../../assets/images/car4.png')} style={styles.image} />
          <Text style={styles.title}>Create Your Account</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
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
                <Text style={styles.label}>Email</Text>
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

          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/Home" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Log in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 15,
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