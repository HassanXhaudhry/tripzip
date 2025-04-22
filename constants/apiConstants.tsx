import Constants from 'expo-constants';
import { Platform } from 'react-native';

type CustomExtra = {
  EXPO_PUBLIC_ENV?: string;
  EXPO_PUBLIC_API_URL?: string;
  EXPO_PUBLIC_SOCKET_URL?: string;
  EXPO_PUBLIC_JWT_EXPIRES_IN?: string;
};

const extra = (Constants.expoConfig?.extra ?? Constants.manifest2?.extra) as CustomExtra;

export const ENV = extra.EXPO_PUBLIC_ENV || 'development';

export const API_URL = (() => {
  const configUrl = extra.EXPO_PUBLIC_API_URL || 'http://115.186.137.140:8181';
  console.log(`🔧 API URL configuration for ${ENV}:`, configUrl);
  return configUrl;
})();

export const SOCKET_URL = (() => {
  const configUrl = extra.EXPO_PUBLIC_SOCKET_URL || 'http://115.186.137.140:8181';
  console.log(`🔧 Socket URL configuration for ${ENV}:`, configUrl);
  return configUrl;
})();

export const JWT_EXPIRES_IN = extra.EXPO_PUBLIC_JWT_EXPIRES_IN || '1d';

// Useful for debugging build environments
export const logEnvironmentInfo = () => {
  console.log('🔧 Environment:', ENV);
  console.log('🔧 Platform:', Platform.OS);
  console.log('🔧 API URL:', API_URL);
  console.log('🔧 Socket URL:', SOCKET_URL);
  console.log('🔧 Build type:', __DEV__ ? 'Development' : 'Production/Preview');
};