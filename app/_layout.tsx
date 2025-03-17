import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';


export default function RootLayout() {
  useFrameworkReady();

  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return (
      <View style={styles.splashContainer}>
        <Image 
          source={require('../assets/images/splash.png')} 
          style={styles.splashImage} 
        />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </Provider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
