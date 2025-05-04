import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import Chat from "./Chat";
import Profile from "./Profile";
import CustomDrawerContent from "@/components/CustomDrawer";

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}