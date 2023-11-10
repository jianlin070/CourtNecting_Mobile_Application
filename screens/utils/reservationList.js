import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ButtonText,
  TouchableNativeFeedback,
} from "react-native";
import { Card } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { StyledButtonRes, Colors } from "../../components/styles";
import { SERVER_IP } from "../../config";
import ControlCourt from "../controlCourt";

const { green, primary } = Colors;

const NoReservationIcon = require("../../assets/img/no-reservation.png");

// credentials context
import { CredentialsContext } from "../../components/CredentialsContext";
import { listReservation } from "./Reservation";

export default function ReservationList({ navigation, route }) {
  const [reservations, setReservations] = useState([]);
  const isFocused = useIsFocused();
  const [isRefresh, setIsRefresh] = useState(false);
  const [resetView, setResetView] = useState(false);
  const { type } = route.params;

  // console.log(type);

  // credentials context
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const resetComponent = () => {
    setReservations([]);
    setIsRefresh(false);
    // Add any other state resets or cleanup logic here
  };

  async function getReservations() {
    // console.log("Getting reservations");
    listReservation(
      storedCredentials.email,
      () => {},
      () => {},
      (data) => {
        // console.log("data >>> ", data);
        let _date = new Date().getTime();
        if (data.length > 0) {
          let _data = [];
          data.forEach((d) => {
            _dateAdded = new Date(d.datetime).getTime();
            endTime = new Date(_dateAdded);
            endTime.setHours(endTime.getHours() + 2);
            if (type == "Upcoming") {
              if (_dateAdded > _date) _data.push(d);
            }
            if (type == "Expired") {
              if (endTime < _date) _data.push(d);
            }
            if (type == "Active") {
              if (_dateAdded <= _date && _date <= endTime) _data.push(d);
            }
          });
          setReservations(_data);
          setResetView(true);
        }
      }
    );
  }

  const NoReservationMessage = ({ type }) => {
    let message = "";

    if (type === "Active") {
      message = "No active reservations yet";
    } else if (type === "Upcoming") {
      message = "No upcoming reservations yet";
    } else if (type === "Expired") {
      message = "No expired reservations yet";
    } else {
      message = "No reservations yet";
    }

    return (
      <Text
        style={
          (style = {
            fontSize: 17,
            textAlign: "center",
            marginBottom: 8,
            paddingTop: 20,
          })
        }
      >
        {message}
      </Text>
    );
  };

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     getReservations();
  //   }, 1);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [isFocused]);

  useEffect(() => {
    getReservations();
    // Reset the component when it first mounts or when it becomes focused
    resetComponent();
  }, [isFocused]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {reservations.length == 0 ? (
        <View
          style={{
            flex: 1,
            marginHorizontal: 16,
            alignItems: "center",
            justifyContent: "center",
            marginTop: -50,
          }}
        >
          <Image source={NoReservationIcon} style={{ height: 75, width: 75 }} />
          <NoReservationMessage type={type} />
        </View>
      ) : (
        <FlatList
          style={{ paddingHorizontal: 8 }}
          keyExtractor={(item) => item._id.toString()}
          data={reservations}
          refreshing={isRefresh}
          onRefresh={async () => {
            setIsRefresh(true);
            await getReservations();
            setIsRefresh(false);
          }}
          renderItem={({ item }) => {
            return (
              <TouchableNativeFeedback
                disabled={type !== "Active"}
                onPress={() => {
                  navigation.navigate("ControlCourt", {
                    courtNo: item.court_no,
                    endTime: new Date(
                        new Date(item.datetime).getTime() + 2 * 60 * 60 * 1000
                    )
                  });
                }}
                background={
                  Platform.OS === "android"
                    ? TouchableNativeFeedback.SelectableBackground()
                    : ""
                }
              >
                <Card
                  style={
                    type !== "Active"
                      ? {
                          marginBottom: 8,
                          backgroundColor: "white",
                          elevation: 0,
                        }
                      : { marginBottom: 8, elevation: 5 }
                  }
                >
                  <Card.Title
                    title={`Court Number: ${item.court_no}`}
                    titleStyle={{
                      color: green,
                      fontSize: 18, // Adjust the size as needed
                      fontWeight: "bold", // Make it bold
                      marginBottom: -10,
                    }}
                  />
                  <Card.Content style={{ margin: 0 }}>
                    <Text style={{ fontSize: 16 }}>
                      Date:{" "}
                      {new Date(item.datetime).toLocaleDateString("en-US", {
                        timeZone: "Asia/Kuala_Lumpur",
                      })}
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      Timeslot:{" "}
                      {new Date(item.datetime).toLocaleTimeString("en-US", {
                        timeZone: "Asia/Kuala_Lumpur",
                      })}{" "}
                      -{" "}
                      {new Date(
                        new Date(item.datetime).getTime() + 2 * 60 * 60 * 1000
                      ).toLocaleTimeString("en-US", {
                        timeZone: "Asia/Kuala_Lumpur",
                      })}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>Duration: 2 Hour(s)</Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: green,
                        }}
                      >
                        {type}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableNativeFeedback>
            );
          }}
        />
      )}
    </View>
  );
}
