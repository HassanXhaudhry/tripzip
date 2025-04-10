import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

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

  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        {footerItems.map((item) => (
          <TouchableOpacity
            key={item.path}
            style={styles.bottomNavItem}
            onPress={() => router.push(item.path)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
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
