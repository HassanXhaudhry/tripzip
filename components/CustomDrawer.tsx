import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";


const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const pathname = usePathname();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoWrapper}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/26.jpg" }}
          width={80}
          height={80}
          style={styles.userImg}
        />
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john@email.com</Text>
        </View>
      </View>

      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="home"
            size={size}
            color={pathname === "/(drawer)/Home" ? "#fff" : "#000"}
          />
        )}
        label={"Home"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/(drawer)/Home" ? "#fff" : "#000" },
        ]}
        style={{
          backgroundColor: pathname === "/(drawer)/Home" ? "#333" : "#fff",
        }}
        onPress={() => router.push("/(drawer)/Home")}
      />

      <DrawerItem
        icon={({ color, size }) => (
          <AntDesign
            name="message1"
            size={size}
            color={pathname === "/(drawer)/Chat" ? "#fff" : "#000"}
          />
        )}
        label={"Chat"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/(drawer)/Chat" ? "#fff" : "#000" },
        ]}
        style={{
          backgroundColor: pathname === "/(drawer)/Chat" ? "#333" : "#fff",
        }}
        onPress={() => router.push("/(drawer)/Chat")}
      />
            <DrawerItem
        icon={({ color, size }) => (
          <AntDesign
            name="profile"
            size={size}
            color={pathname === "/(drawer)/Profile" ? "#fff" : "#000"}
          />
        )}
        label={"Profile"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/(drawer)/Profile" ? "#fff" : "#000" },
        ]}
        style={{
          backgroundColor: pathname === "/(drawer)/Profile" ? "#333" : "#fff",
        }}
        onPress={() => router.push("/(drawer)/Profile")}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
});
