import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Username from "./updateUsername";
import Email from "./updateEmail";
import Password from "./updatePassword";
import Profile from "./profile";

export default function ProfileStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Username"
        component={Username}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Email"
        component={Email}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Password"
        component={Password}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
