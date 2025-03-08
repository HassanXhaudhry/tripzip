import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SplashScreenNavigationProp } from '@/utils/types';

// Prevent auto-hiding of splash
SplashScreen.preventAutoHideAsync();

const Splash = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const prepareApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await SplashScreen.hideAsync();
      navigation.replace('Home');  // This works now because it's correctly typed
    };

    prepareApp();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/splash.png')} 
        style={styles.image} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Splash;
