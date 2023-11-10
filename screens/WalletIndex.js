import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReloadDialog from "./ReloadDialog";
import WalletMain from "./Wallet";
const Stack = createNativeStackNavigator();

export default function WalletStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="Wallet">
      <Stack.Screen
        name="WalletMain"
        component={WalletMain}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReloadDialog"
        component={ReloadDialog}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
