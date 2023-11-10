import React, { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Card } from "react-native-elements/dist/card/Card";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { CredentialsContext } from "../../components/CredentialsContext";

import { Colors } from "../../components/styles";

export default function Profile({ navigation }) {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Email</Text>
            <Icon name="lock" type="material" size={24} color={Colors.red} />
          </View>
          <View style={styles.cardDivider} />
          <Text style={styles.cardContent}>{storedCredentials.email}</Text>
        </Card>
        <Card containerStyle={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Name</Text>
            <Icon
              name="pencil"
              type="material"
              size={24}
              color={Colors.green}
              onPress={() => {
                navigation.navigate("Username", {
                  username: storedCredentials.name,
                });
              }}
            />
          </View>
          <View style={styles.cardDivider} />
          <Text style={styles.cardContent}>{storedCredentials.name}</Text>
        </Card>
        <Card containerStyle={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Password</Text>
            <Icon
              name="pencil"
              type="material"
              size={24}
              color={Colors.green}
              onPress={() => {
                navigation.navigate("Password");
              }}
            />
          </View>
          <View style={styles.cardDivider} />
          <Text style={styles.cardContent}>********</Text>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderWidth: 0,
    elevation: 1,
    backgroundColor: "white",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    color: "black",
  },
  cardContent: {
    fontSize: 16,
    color: "gray",
  },
  cardDivider: {
    marginVertical: 8,
  },
});
