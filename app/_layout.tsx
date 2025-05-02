import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import { RootState, store, AppDispatch } from "../store/store";
import { loadToken } from "../store/slices/authSlice";
import * as SplashScreen from 'expo-splash-screen';

function AuthLayout() {
  const dispatch = useDispatch<AppDispatch>();
  SplashScreen.preventAutoHideAsync();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Home" />
      ) : (
        <Stack.Screen name="Login" />
      )}
      <Stack.Screen name="Signup" />
      <Stack.Screen name="(drawer)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthLayout />
    </Provider>
  );
}