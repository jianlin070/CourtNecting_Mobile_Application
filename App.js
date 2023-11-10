import React, { useState, useEffect } from "react";
import { StatusBar, StyleSheet } from 'react-native';

// React navigation stack
import RootStack from "./navigators/RootStack";

import * as SplashScreen from 'expo-splash-screen';

// async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// credentials context
import { CredentialsContext } from './components/CredentialsContext';

import { Colors } from './components/styles';
const { green, primary } = Colors;

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  useEffect(() => {
    async function prepare() {
      try {
        // Prevent splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();

        await checkLoginCredentials();

        // Mark app as ready
        setAppReady(true);

        // Hide splash screen
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);
  
  const checkLoginCredentials = () => {
    AsyncStorage.getItem('courtNectingCredentials')
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <StatusBar backgroundColor={green} barStyle="light-content"/>
      <RootStack />
    </CredentialsContext.Provider>
  );
}

const styles = StyleSheet.create({
  statusbar: { backgroundColor:{primary}, barStyle:"light-content"}

});
