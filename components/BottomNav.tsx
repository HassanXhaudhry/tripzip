import { View, TouchableOpacity, StyleSheet, Keyboard, Platform, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';

type FooterItem = {
  label: string;
  path: '/(tabs)/Home' | '/(tabs)/Chat' | '/(tabs)/Profile';
  icon: 'home' | 'file-text' | 'user';
};

const footerItems: FooterItem[] = [
  { label: 'Home', path: '/(tabs)/Home', icon: 'home' },
  { label: 'Chat', path: '/(tabs)/Chat', icon: 'file-text' },
  { label: 'Profile', path: '/(tabs)/Profile', icon: 'user' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        // Get keyboard height and animate the nav away
        const keyboardHeight = event.endCoordinates.height;
        Animated.timing(slideAnim, {
          toValue: keyboardHeight + 100, // Move it beyond the keyboard
          duration: Platform.OS === 'ios' ? 250 : 150, // Match keyboard animation speed
          useNativeDriver: true,
        }).start();
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // Animate the nav back
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 250 : 150, // Match keyboard animation speed
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [slideAnim]);

  return (
    <Animated.View 
      style={[
        styles.bottomNavContainer,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.bottomNav}>
        {footerItems.map((item) => (
          <TouchableOpacity
            key={item.path}
            style={styles.bottomNavItem}
            onPress={() => {
              Keyboard.dismiss(); // Dismiss keyboard if it's open
              router.push(item.path);
            }}
          >
            <View
              style={[
                styles.iconContainer,
                pathname === item.path.replace('/(tabs)/', '/') && styles.activeIconContainer,
              ]}
            >
              <Feather name={item.icon} size={24} color="white" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#333333',
    marginHorizontal: 20,
    height: 70,
    borderRadius: 40,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: '#FFB300',
    borderRadius: 40
  },
});