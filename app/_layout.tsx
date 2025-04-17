import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import { RootState, store, AppDispatch } from "../store/store";
import { loadToken } from "../store/slices/authSlice";

function AuthLayout() {
  useFrameworkReady();
  const dispatch = useDispatch<AppDispatch>();
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