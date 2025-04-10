import { Stack } from 'expo-router';
export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" />
      <Stack.Screen name="Profile" />
      <Stack.Screen name="Chat" />
    </Stack>
  );
}
