import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { DrawerContent } from "./../screens/DrawerContent";
import Login from "./../screens/Login";
import Signup from "./../screens/Signup";
import Welcome from "./../screens/Welcome";
import Reservation from "./../screens/Reservation";
import History from "./../screens/History";
import Wallet from "./../screens/WalletIndex";

import { Colors } from "./../components/styles";
const { tertiary, primary, green } = Colors;

import { CredentialsContext } from "./../components/CredentialsContext";
import Transaction from "../screens/Transaction";
import ProfileStack from "../screens/profileStack";
import ControlCourt from "../screens/controlCourt";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "transparent",
      },
      headerTintColor: tertiary,
      headerTransparent: true,
      headerTitle: "",
      headerLeftContainerStyle: {
        paddingLeft: 20,
      },
    }}
  >
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
  </Stack.Navigator>
);

const AppDrawer = () => (
  <Drawer.Navigator
    initialRouteName="Welcome"
    screenOptions={{
      drawerStyle: {
        width: 250,
      },
      headerTitleAlign: "center",
      headerTitleStyle: {
        color: primary,
      },
      headerStyle: {
        backgroundColor: green,
      },
    }}
    drawerContent={(props) => <DrawerContent {...props} />}
  >
    <Drawer.Screen
      name="Welcome"
      component={Welcome}
      options={{ headerShown: false }}
    />
    <Drawer.Screen name="Reservation" component={Reservation} />
    <Drawer.Screen name="History" component={History} />
    <Drawer.Screen name="Wallet" component={Wallet} />
    <Drawer.Screen name="Transactions" component={Transaction} />
    <Drawer.Screen name="Profile" component={ProfileStack} />
    <Drawer.Screen name="ControlCourt" component={ControlCourt}/>
  </Drawer.Navigator>
);

const RootStack = () => {
  // Check the authentication status
  const { storedCredentials } = useContext(CredentialsContext);

  return (
    <NavigationContainer>
      {storedCredentials ? <AppDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootStack;
