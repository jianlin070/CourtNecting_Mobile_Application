import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  BackHandler,
  Alert,
} from "react-native";
import axios from "axios";
import io from "socket.io-client";

const picoWUrl = "http://192.168.68.116:3002";

export default function ControlCourt({ navigation, route }) {
  const [netHeight, setNetHeight] = useState(0);
  const [lightsOn, setLightsOn] = useState(false);
  const [activated, setActivated] = useState(false);
  const { courtNo, endTime } = route.params;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleIncreaseNetHeight = () => {
    if (!activated) {
      return;
    }

    const newNetHeight = Math.min(7, netHeight + 1);
    if (newNetHeight === netHeight) {
      Alert.alert(
        "Maximum Height Reached",
        "You have reached the maximum net height."
      );
    } else {
      setNetHeight(newNetHeight);
      axios.get(`${picoWUrl}/up-net`);
    }
  };

  const handleDecreaseNetHeight = () => {
    if (!activated) {
      return;
    }

    const newNetHeight = Math.max(0, netHeight - 1);
    if (newNetHeight === netHeight) {
      Alert.alert(
        "Minimum Height Reached",
        "You have reached the minimum net height."
      );
    } else {
      setNetHeight(newNetHeight);
      axios.get(`${picoWUrl}/down-net`);
    }
  };

  const handleDefaultNetHeight = () => {
    if (!activated) {
      return;
    }

    setNetHeight(4);
    axios.get(`${picoWUrl}/default-net`);
  };

  const handleToggleLights = () => {
    if (!activated) {
      return;
    }

    setLightsOn(!lightsOn);
    const newLightsOn = !lightsOn;

    if (newLightsOn === true) {
      axios.get(`${picoWUrl}/on-light`);
    }

    if (newLightsOn === false) {
      axios.get(`${picoWUrl}/off-light`);
    }
  };

  const handleActivation = async () => {
    setActivated(true);
    setLightsOn(true);
    setNetHeight(4);
    try {
      const response = await axios.get(`${picoWUrl}/ac-court`);
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("Error communicating with the server:", error);
    }
  };

  const handleDeactivation = async () => {
    setActivated(false);
    setLightsOn(false);
    setNetHeight(0);
    try {
      const response = await axios.get(`${picoWUrl}/de-court`);
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("Error communicating with the server:", error);
    }
  };

  useEffect(() => {
    const backHandler = () => {
      // Navigate to the specific screen you want
      navigation.navigate("History");
      clearInterval(intervalId); // Stop the interval when navigating away
      return true; // Prevent default behavior (exit the app)
    };

    // Subscribe to the hardware back button press event
    const backHandlerSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backHandler
    );

    const intervalId = setInterval(() => {
      const now = new Date();
      console.log("Now: ", now, "End Time: ", endTime);
      if (now >= endTime) {
        console.log("in");
        handleDeactivation();
        navigation.navigate("History"); // Assuming navigation is accessible here
        clearInterval(intervalId); // Stop the interval once triggered
      }
    }, 1000); // Check every second

    return () => {
      // Clean up subscriptions and intervals when the component unmounts
      backHandlerSubscription.remove();
      clearInterval(intervalId);
    };
  }, [endTime, handleDeactivation, navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Court " + courtNo,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.activateContainer}>
        <Button
          title={activated ? "Deactivate" : "Activate"}
          onPress={activated ? handleDeactivation : handleActivation}
          color={activated ? "red" : "blue"}
          style={styles.activateButton}
        />
      </View>
      <Text style={styles.label}>Net Height: {netHeight}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="-"
          onPress={handleDecreaseNetHeight}
          disabled={!activated}
        />
        <Button
          title="Default"
          onPress={handleDefaultNetHeight}
          disabled={!activated}
        />
        <Button
          title="+"
          onPress={handleIncreaseNetHeight}
          disabled={!activated}
        />
      </View>

      <Text style={styles.label}>Lights: {lightsOn ? "On" : "Off"}</Text>
      <Button
        title={lightsOn ? "Turn Off Lights" : "Turn On Lights"}
        onPress={handleToggleLights}
        disabled={!activated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 70,
  },
  activateContainer: {
    marginTop: -70,
    marginBottom: 100,
  },
  activateButton: {
    borderRadius: 10,
    height: 50,
    fontSize: 20,
  },
});
