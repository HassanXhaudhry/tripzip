import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
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

  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return (
      <View style={styles.splashContainer}>
        <Image source={require("../assets/images/splash.png")} style={styles.splashImage} />
      </View>
    );
  }

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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  splashImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
