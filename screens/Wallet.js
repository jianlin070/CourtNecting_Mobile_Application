import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, StatusBar, ToastAndroid } from "react-native";
import { Button, Divider } from "react-native-elements";
import { TextInput, HelperText } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { SERVER_IP } from "../config";
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
} from "../components/styles";

const { green, primary } = Colors;

import { CredentialsContext } from "../components/CredentialsContext";
import { addCredit } from "./utils/User";
import { CurrentRenderContext } from "@react-navigation/native";

export default function WalletMain({ navigation }) {
  const [amount, setAmount] = useState("");

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  function handleOnChangeAmount(amount) {
    if (amount.match(/^[0-9]{0,3}$/)) {
      if (amount.length > 0) setAmount(parseInt(amount).toString());
      else setAmount(amount.toString());
    }
  }

  function isReloadButtonEnable() {
    return amount !== "" && parseInt(amount) >= 10;
  }

  async function handleReload() {
    if (amount < 10 || amount > 999) return;

    data = {
      email: storedCredentials.email,
      credits: parseInt(amount),
    };

    addCredit(
      data,
      (message, err) => {
        if (err) {
          ToastAndroid.show("Can not add credit!", ToastAndroid.SHORT);
        }
      },
      (data) => {
        setStoredCredentials(data);
        navigation.replace("ReloadDialog");
      }
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.reloadAmount}>
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                paddingTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "green",
                  padding: 16,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ fontSize: 15, textAlign: "center", color: "white" }}
                >
                  Credit balance
                </Text>
                <Text
                  style={{ fontSize: 30, textAlign: "center", color: "white" }}
                >
                  {storedCredentials.credits}
                </Text>
              </View>
            </View>
            <Text style={[styles.reloadTitle, { paddingTop: 40 }]}>
              Reload your credit(s)
            </Text>

            <TextInput
              keyboardType="numeric"
              label="Enter preferable amount"
              style={{ backgroundColor: "white" }}
              theme={{
                colors: {
                  primary: "black",
                },
              }}
              selectionColor={"#8bd0c8"}
              underlineColor={"#0A5688"}
              placeholderTextColor={"#0A5688"}
              onChangeText={handleOnChangeAmount}
              value={amount}
            />
            <HelperText style={{}}>Min reload amount is 10 credits</HelperText>
          </View>
          <View style={styles.rowButtons}>
            <Button
              {...(amount === "10" ? selectedStyle : unselectedStyle)}
              title="10"
              type="outline"
              onPress={() => handleOnChangeAmount("10")}
            />
            <Button
              {...(amount === "20" ? selectedStyle : unselectedStyle)}
              title="20"
              type="outline"
              onPress={() => handleOnChangeAmount("20")}
            />
            <Button
              {...(amount === "30" ? selectedStyle : unselectedStyle)}
              title="30"
              type="outline"
              onPress={() => handleOnChangeAmount("30")}
            />
          </View>
          <View style={styles.rowButtons}>
            <Button
              {...(amount === "50" ? selectedStyle : unselectedStyle)}
              title="50"
              type="outline"
              onPress={() => handleOnChangeAmount("50")}
            />
            <Button
              {...(amount === "100" ? selectedStyle : unselectedStyle)}
              title="100"
              type="outline"
              onPress={() => handleOnChangeAmount("100")}
            />
            <Button
              {...(!["10", "20", "30", "50", "100"].includes(amount)
                ? selectedStyle
                : unselectedStyle)}
              title="Others"
              type="outline"
              onPress={() => {
                handleOnChangeAmount("");
              }}
            />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.reloadTotal}>
            Total: RM {amount === "" ? 0 : amount}
          </Text>
          <Divider orientation="horizontal" style={{ marginVertical: 16 }} />
          <Button
            title="Pay Now"
            buttonStyle={{ backgroundColor: "#35B76C" }}
            disabled={!isReloadButtonEnable()}
            onPress={handleReload}
          ></Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  colButton: {
    flex: 1,
    margin: 8,
    color: "#35B76C",
  },
  reloadAmount: {
    // marginTop: 16,
  },
  reloadTitle: {
    fontSize: 18,
    color: green,
    fontWeight: "bold",
  },
  reloadTotal: {
    fontSize: 18,
    color: green,
  },
  bottomSection: {
    marginVertical: 16,
    marginHorizontal: 8,
  },
});

const selectedStyle = {
  buttonStyle: {
    borderColor: "#35B76C",
    borderWidth: 1,
    backgroundColor: "#35B76C",
  },
  titleStyle: { color: "white" },
  containerStyle: styles.colButton,
};

const unselectedStyle = {
  buttonStyle: {
    borderColor: "black",
    borderWidth: 1,
  },
  titleStyle: { color: "black" },
  containerStyle: styles.colButton,
};
