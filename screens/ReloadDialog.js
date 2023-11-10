import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-elements";

const ReloadDoneIcon = require("../assets/img/reload-done.png");

import { CredentialsContext } from "../components/CredentialsContext";

export default function ReloadDialog({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  function handlePressDone() {
    navigation.replace("WalletMain");
  }

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Image style={styles.icon} source={ReloadDoneIcon} />
        <View style={styles.divider}></View>
        <Text style={styles.title}>Reload </Text>
        <Text style={styles.title}>successfully </Text>
        <View style={styles.divider}></View>
        <Text style={styles.content}>
          Your credit balance: {storedCredentials.credits}
        </Text>
      </View>

      <Button
        title="Done"
        buttonStyle={{
          backgroundColor: "#35B76C",
          width: 150,
        }}
        titleStyle={{ textAlign: "center"}}
        onPress={handlePressDone}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    color: "#35B76C",

  },
  content: {
    fontSize: 19,
    textAlign: "center",
    color: "#0A5688",

  },
  icon: {
    height: 100,
    width: 100,
  },
  divider: {
    marginVertical: 8,
  },
  sectionDivider: {
    marginVertical: 24,
  },
});
