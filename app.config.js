import 'dotenv/config';
export default {
  expo: {
    name: "TripZip",
    slug: "tripzip",
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.tripzip',
      runtimeVersion: {
        policy: 'appVersion',
      },
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSExceptionDomains: {
            '115.186.137.140': {
              NSIncludesSubdomains: true,
              NSTemporaryExceptionAllowsInsecureHTTPLoads: true
            }
          }
        }
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/iconbg.png',
        backgroundColor: "#FFB300",
      },
      package: 'com.anonymous.tripzip',
      runtimeVersion: '1.0.0',
      permissions: ["INTERNET", "ACCESS_NETWORK_STATE"],
      config: {
        networkSecurityConfig: "././xml/network_security_config.xml"
      },
      usesCleartextTraffic: true
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/iconbg.png',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-asset',
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splashbg.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#FFB300",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    updates: {
      enabled: true,
      checkAutomatically: 'ON_LOAD',
      fallbackToCacheTimeout: 30000,
      url: 'http://u.expo.dev/75339bd9-65f1-429d-9d1f-a1fa76fae4a5',
    },
    extra: {
      eas: {
        projectId: '75339bd9-65f1-429d-9d1f-a1fa76fae4a5',
      },
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      EXPO_PUBLIC_SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL,
      EXPO_PUBLIC_JWT_EXPIRES_IN: process.env.EXPO_PUBLIC_JWT_EXPIRES_IN || "1d",
      EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV || "development",
    },
  },
};