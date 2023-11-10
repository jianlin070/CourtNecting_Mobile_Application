import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";

import { CredentialsContext } from "../../components/CredentialsContext";
import { signOut } from "../DrawerContent";
import { updateUser } from "../utils/User";
import { ProfileHeader } from "./profileHeader";

export default function UpdateEmail({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const [newEmail, setNewEmail] = useState(storedCredentials.email);
  const [error, setError] = useState("");

  async function handleUpdateEmail() {
    data = {
      email: storedCredentials.email,
      new_email: newEmail,
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
        Alert.alert(
          "Sign In Requried",
          `You need to sign in again when the email is udpated.`,
          [
            {
              text: "Sign In Again",
              onPress: () => {
                signOut(setStoredCredentials);
              },
              style: "cancel",
            },
          ]
        );
      }
    );
  }

  async function handleOnChangeEmail(email) {
    setNewEmail(email);

    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      setError("Invalid email");
    }
  }

  function isSaveButtonEnable() {
    return storedCredentials.email !== newEmail && error === "";
  }


  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: "hello",
  //         headerRight: () => (
  //           <Button
  //             onPress={() => alert('This is a button!')}
  //             title="Info"
  //             color="#fff"
  //           />
  //         ),
  //   });
  // }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <TextInput
          label="Email"
          style={styles.formInput}
          theme={{
            colors: {
              // primary: THEME.secondaryColor,
            },
          }}
          value={newEmail}
          // selectionColor={THEME.selectionColor}
          // underlineColor={THEME.secondaryColor}
          // placeholderTextColor={THEME.secondaryColor}
          onChangeText={handleOnChangeEmail}
        ></TextInput>
        <HelperText type="error" visible={error}>
          {error}
        </HelperText>
        <View style={{ marginVertical: 16 }}>
          <Button
            mode="contained"
            // color={THEME.primaryColor}
            theme={{ colors: { primary: "black" } }}
            onPress={handleUpdateEmail}
            disabled={!isSaveButtonEnable()}
          >
            <Text style={{ color: "white"}}>
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
