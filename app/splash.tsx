// import React, { useEffect } from 'react';
// import * as SplashScreen from 'expo-splash-screen';
// import { View, Image, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router';

// SplashScreen.preventAutoHideAsync();

// const Splash = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const prepareApp = async () => {
//       await new Promise(resolve => setTimeout(resolve, 5000));
//       await SplashScreen.hideAsync();
//       router.replace('/(tabs)');  
//     };

//     prepareApp();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Image 
//         source={require('../assets/images/splash.png')} 
//         style={styles.image} 
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
// });

// export default Splash;
