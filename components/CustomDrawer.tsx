import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { router } from 'expo-router';
import { logout } from "@/store/slices/authSlice";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface MenuItem {
  name: string;
  icon: FeatherIconName;
  onPress: () => void;
}

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { navigation, state } = props;
  const dispatch = useDispatch<AppDispatch>();
  const fullname = useSelector((state: RootState) => state.auth.user?.cus_fullname);
  
  const isRouteActive = (routeName: string) => {
    const currentRouteName = state.routes[state.index].name;
    return currentRouteName === routeName;
  };
  
  const handleLogout = async () => {
    await dispatch(logout());
    router.replace('/(auth)/Login');
  };
  
  const menuItems: MenuItem[] = [
    {
      name: "Home",
      icon: "home",
      onPress: () => navigation.navigate("Home")
    },
    {
      name: "Profile",
      icon: "user",
      onPress: () => navigation.navigate("Profile")
    },
    {
      name: "MyBooking",
      icon: "calendar",
      onPress: () => navigation.navigate("MyBooking")
    },
    {
      name: "SavedPlaces",
      icon: "map-pin",
      onPress: () => navigation.navigate("SavedPlaces")
    },
    {
      name: "Settings",
      icon: "settings",
      onPress: () => navigation.navigate("Settings")
    },
    {
      name: "Help",
      icon: "help-circle",
      onPress: () => navigation.navigate("Help")
    }
  ];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
        scrollEnabled={false}
      >
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/lego/5.jpg" }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{fullname || "User"}</Text>
        </View>

        <View style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                isRouteActive(item.name) && styles.activeMenuItem
              ]}
              onPress={item.onPress}
            >
              <Feather
                name={item.icon}
                size={22}
                color={isRouteActive(item.name) ? '#FFFFFF' : '#000000'}
                style={styles.menuIcon}
              />

              <Text
                style={[
                  styles.menuText,
                  isRouteActive(item.name) && styles.activeMenuText
                ]}
              >
                {item.name === "MyBooking" ? "My Booking" : 
                 item.name === "SavedPlaces" ? "Saved Places" : item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={22} color="#000000" style={styles.menuIcon} />
          <Text style={styles.menuText}>Log Out</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden'
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'space-between'
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FFB300'
  },
  profileName: {
    color: '#000000',
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500'
  },
  menuItems: {
    marginTop: 20
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20
  }, 
  activeMenuText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  activeMenuItem: {
    backgroundColor: '#FFB300',
    borderRightWidth: 3,
    borderRightColor: '#000000',
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuText: {
    color: '#000000',
    fontSize: 16
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 20
  }
});