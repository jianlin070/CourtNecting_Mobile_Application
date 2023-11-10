import React, { useState, useLayoutEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";

import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  Line, 
  WelcomeContainer,
  WelcomeImage,
  Avatar,
  Colors
} from "../components/styles";

const { tertiary, primary, secondary, green, brand } = Colors;

// Async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const Welcome = ({ navigation }) => {

    // credentials context
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

    const { name, email, photoUrl } = storedCredentials;

    const AvatarImg = photoUrl
    ? {
        uri: photoUrl,
      }
    : require('./../assets/img/welcome.jpg');

    return (  
        <StyledContainer>
            <InnerContainer>
                <WelcomeImage style={{ marginTop: -70 }} resizeMode="cover" source={require("./../assets/img/welcome.jpg")}/>
                <WelcomeContainer>
                    <PageTitle welcome={true}>Welcome!</PageTitle>
                    <SubTitle welcome={true}>
                       {name  || "Error"}
                    </SubTitle>
                    <SubTitle welcome={true}>
                        {email || 'Error'}
                    </SubTitle>
                    <StyledFormArea>
                    <Avatar 
                        resizeMode="cover"
                        source={require("./../assets/img/logo.png")}
                    />
                        <Line />
                        <StyledButton onPress={() => navigation.navigate('Reservation')}>
                            <ButtonText>BOOK NOW</ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                </WelcomeContainer>
            </InnerContainer>
        </StyledContainer>
    );
};

export default Welcome;
