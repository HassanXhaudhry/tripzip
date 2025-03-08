import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from '@/screens/Signup';
import Splash from './splash';
import Home from './Home';
const Stack = createStackNavigator();
export default function App() {
  return (
      <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Splash"
          component={Splash}
        />
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
        />
      </Stack.Navigator>
  );
}