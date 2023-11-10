import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ReservationList from "./utils/reservationList";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createMaterialTopTabNavigator();

const History = () => {
  
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Active"
        component={ReservationList}
        initialParams={{ type: "Active" }}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: focused ? "green" : "gray", fontSize: 13 }}>
              ACTIVE
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Upcoming"
        component={ReservationList}
        initialParams={{ type: "Upcoming" }}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: focused ? "#FFB81C" : "gray", fontSize: 13 }}>
              UPCOMING
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Expired"
        component={ReservationList}
        initialParams={{ type: "Expired" }}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ color: focused ? "red" : "gray", fontSize: 13 }}>
              EXPIRED
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});
