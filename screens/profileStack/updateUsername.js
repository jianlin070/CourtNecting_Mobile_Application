import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { updateUser } from "../utils/User";

import { CredentialsContext } from "../../components/CredentialsContext";

export default function UpdateUsername({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const [newUsername, setNewUsername] = useState(storedCredentials.name);
  const [error, setError] = useState("");

  async function handleUpdateUsername() {
    data = {
      email: storedCredentials.email,
      name: newUsername,
    };
    updateUser(
      data,
      (mes, err) => {
        if (err && mes) {
          setError(mes);
        }
      },
      (data) => {
        setStoredCredentials(data);
        navigation.pop();
      }
    );
  }

  function handleOnChangeUsername(username) {
    setNewUsername(username);
    if (username.length < 6 || username.length > 20) {
      setError("Name's length must be in between 6-20");
    } else {
      setError("");
    }
  }

  function isSaveButtonEnable() {
    return storedCredentials.name !== newUsername && error === "";
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TextInput
          label="Name"
          style={styles.formInput}
          theme={{
            colors: {
              // primary: THEME.secondaryColor,
            },
          }}
          value={newUsername}
          // selectionColor={THEME.selectionColor}
          // underlineColor={THEME.secondaryColor}
          // placeholderTextColor={THEME.secondaryColor}
          onChangeText={handleOnChangeUsername}
        ></TextInput>
        <HelperText type="error" visible={error}>
          {error}
        </HelperText>
        <View style={{ marginVertical: 16 }}>
          <Button
            mode="contained"
            color={"#00ff00"}
            theme={{ colors: { primary: "black" } }}
            onPress={handleUpdateUsername}
            disabled={!isSaveButtonEnable()}
          >
            <Text style={{ color: "white" }}>
              Save
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    padding: 8,
    backgroundColor: "white",
  },
  formInput: {
    backgroundColor: "white",
  },
});
