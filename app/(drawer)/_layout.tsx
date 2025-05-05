import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet, TouchableOpacity, I18nManager } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Home from "./Home";
import MyBooking from "./MyBooking";
import Settings from "./Settings";
import Profile from "./Profile";
import SavedPlaces from "./SavedPlaces";
import CustomDrawerContent from "@/components/CustomDrawer";

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FFB300",
          elevation: 0,
          shadowOpacity: 0,
          height: 70
        },
        headerLeft: () => null,
        drawerPosition: 'right', 
        header: ({ navigation, route, options }) => {
          return (
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.tripZip}>TripZip</Text>
                
                <TouchableOpacity
                  onPress={() => navigation.toggleDrawer()}
                >
                  <FontAwesome6 name="bars-staggered" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          );
        },
        drawerStyle: {
          width: 280,
        },
        drawerActiveBackgroundColor: '#FFB300',
        drawerActiveTintColor: '#FFFFFF',
        drawerInactiveTintColor: '#000000',
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerLabel: "Home",
          title: "Home"
        }}
      />
      <Drawer.Screen
        name="MyBooking"
        component={MyBooking}
        options={{
          drawerLabel: "MyBooking",
          title: "MyBooking"
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerLabel: "Settings",
          title: "Settings"
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: "Profile",
          title: "Profile"
        }}
      />
      <Drawer.Screen
        name="SavedPlaces"
        component={SavedPlaces}
        options={{
          drawerLabel: "SavedPlaces",
          title: "SavedPlaces"
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFB300",
    height: 80,
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  tripZip: {
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
  }
});