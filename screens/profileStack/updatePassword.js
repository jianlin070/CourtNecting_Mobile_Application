import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ToastAndroid, Alert, BackHandler,} from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { updateUser } from "../utils/User";

import { CredentialsContext } from "../../components/CredentialsContext";
import { signOut } from "../DrawerContent";
import {
  Colors,
  LeftIcon,
  RightIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledUpdatePassword
} from "../../components/styles";

// Colors
const { brand, darkLight, primary } = Colors;
// icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

export default function UpdatePassword({ route, navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const [hidePassword, setHidePassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);

  useEffect(() => {
    const backHandler = () => {
      // Navigate to the specific screen you want
      navigation.navigate("Profile");
      return true; // Prevent default behavior (exit the app)
    };
  
    // Subscribe to the hardware back button press event
    const backHandlerSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backHandler
    );
  
    return () => {
      backHandlerSubscription.remove();
    };
  }, [navigation]);

  async function handleUpdatePassword() {
    if (newPassword === password) {
      ToastAndroid.show(
        "New Password is the same as Current Password",
        ToastAndroid.SHORT
      );
      return;
    }
    data = {
      email: storedCredentials.email,
      password: newPassword,
      currentPassword: password,
    };
    updateUser(
      data,
      (mes, err) => {
        if (err && mes) {
          setError(mes);
          ToastAndroid.show(mes, ToastAndroid.SHORT);
        }
      },
      (data) => {
        setStoredCredentials(data);
        navigation.pop();
        Alert.alert(
          "Sign In Requried",
          `You need to sign in again when the password is udpated.`,
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

  function isSaveButtonEnable() {
    return (
      password.length > 0 &&
      newPassword.length > 0 &&
      passwordError === "" &&
      newPasswordError === ""
    );
  }

  function handleOnChangePassword(password) {
    setPassword(password);
    setPasswordError("");
  }

  function handleOnChangeNewPassword(newPassword) {
    setNewPassword(newPassword);

    if (newPassword.length < 8 || newPassword.length > 20) {
      setNewPasswordError("Password's length should be in between 8-20");
    } else if (
      newPassword.search(/[A-Za-z]+/) === -1 ||
      newPassword.search(/[0-9]/) === -1
    ) {
      setNewPasswordError("Password must contain both letter and number");
    } else {
      setNewPasswordError("");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <MyTextInput
          label="Current Password"
          icon="key"
          placeholder="* * * * * * * *"
          placeholderTextColor={darkLight}
          onChangeText={handleOnChangePassword}
          // onblur={handleBlur("password")}
          value={password}
          secureTextEntry={hidePassword}
          isPassword={true}
          hidePassword={hidePassword}
          setHidePassword={setHidePassword}
        />
        <HelperText type="error" visible={passwordError}>
          {passwordError}
        </HelperText>

        <MyTextInput
          label="New Password"
          icon="key"
          placeholder="* * * * * * * *"
          placeholderTextColor={darkLight}
          onChangeText={handleOnChangeNewPassword}
          // onblur={handleBlur("password")}
          value={newPassword}
          secureTextEntry={hideNewPassword}
          isPassword={true}
          hidePassword={hideNewPassword}
          setHidePassword={setHideNewPassword}
        />
        <HelperText type="error" visible={newPasswordError}>
          {newPasswordError}
        </HelperText>
        <View style={{ marginVertical: 16 }}>
          <Button
            mode="contained"
            // color={THEME.primaryColor}
            theme={{ colors: { primary: "black" } }}
            onPress={handleUpdatePassword}
            disabled={!isSaveButtonEnable()}
          >
            <Text style={{ color: "white" }}>Save</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const MyTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledUpdatePassword {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "md-eye-off" : "md-eye"}
            size={30}
            color={darkLight}
          />
        </RightIcon>
      )}
    </View>
  );
};

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
