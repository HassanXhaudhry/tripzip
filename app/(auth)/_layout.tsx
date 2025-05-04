import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useDispatch, Provider } from 'react-redux';
import { loadToken } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store/store';
import { store } from '../../store/store';

export default function AuthLayout() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  return (
    
    <Provider store={store}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="/(auth)/Login" />
      <Stack.Screen name="/(auth)/Signup" />
    </Stack>
    </Provider>
  );
}
