import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// credentials context
import { CredentialsContext } from "./../components/CredentialsContext";

export const signOut = (cred) => {
  AsyncStorage.removeItem("courtNectingCredentials")
    .then(() => {
      cred("");
    })
    .catch((error) => console.log(error));
};

export function DrawerContent(props) {
  // credentials context
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { name, email, photoUrl, credits } = storedCredentials;

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
                source={require("./../assets/img/logo.png")}
                size={90}
                style={{ backgroundColor: "transparent", marginLeft: -15 }}
              />
              <View
                style={{
                  marginLeft: 15,
                  marginTop: 15,
                  flexDirection: "column",
                }}
              >
                <Title style={styles.title}>Welcome,</Title>
                <Caption style={styles.caption}>{name}</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="calendar-clock" color={color} size={size} />
              )}
              label="Reservation"
              onPress={() => {
                props.navigation.navigate("Reservation");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="book" color={color} size={size} />
              )}
              label="History"
              onPress={() => {
                props.navigation.navigate("History");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="wallet" color={color} size={size} />
              )}
              label="Wallet"
              onPress={() => {
                props.navigation.navigate("Wallet");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="paperclip" color={color} size={size} />
              )}
              label="Transactions"
              onPress={() => {
                props.navigation.navigate("Transactions");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => {
                props.navigation.navigate("Profile");
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>

      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => {
            signOut(setStoredCredentials);
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
    marginLeft: -8,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    marginLeft: -8,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
