import React, { useContext } from "react";
import { View, FlatList, Text, StatusBar, Image } from "react-native";

const NoReservationIcon = require("../assets/img/no-reservation.png");

import { CredentialsContext } from "../components/CredentialsContext";

import {Colors} from "../components/styles";

const { green, primary } = Colors;

export default function Transaction({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        keyExtractor={(item) => item.toString()}
        data={storedCredentials.creditHistory.reverse()}
        renderItem={({ item }) => (
          <View
            key={item.toString()}
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 16,
              marginBottom: 1,
              alignItems: "center",
            }}
          >
            {/* <Image
              style={{ width: 48, height: 48 }}
              source={
                item.indexOf("Added ") > 0
                  ? NoReservationIcon
                  : NoReservationIcon
              }
            /> */}
            <View style={{ marginHorizontal: 16, flex: 1 }}>
              <Text
                style={{
                  color: "black",
                  fontSize: 16,
                }}
              >
                {item.indexOf("Added") > -1
                  ? "Reload credits"
                  : "Reserve badminton court: "}
                {item.indexOf("%") > -1
                  ? item.slice(item.indexOf("%") + 1, item.length)
                  : ""}
              </Text>
              <Text
                style={{
                  color: "gray",
                  fontSize: 12,
                }}
              >
                {item.slice(item.indexOf("at ") + 3, item.indexOf("GMT"))}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: "right",
                  color: green,
                  fontSize: 16,
                }}
              >
                {item.indexOf("Added ") == -1 ? "-" : "+"}
                {item.slice(item.indexOf(" ") + 1, item.indexOf(" at"))}{" "}
                credit(s)
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
