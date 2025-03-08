import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define your stack's routes
export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Signup: undefined;
};

// Define a type for your navigation prop
export type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;
