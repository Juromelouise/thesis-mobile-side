import { View, ActivityIndicator, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import DrawerNavigation from "./DrawerNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./RootNav";
import { registerForPushNotificationsAsync } from "../utils/Notification";
import { BASE_URL } from "../assets/common/config";
import axios from "axios";

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);
  const [currentPushToken, setCurrentPushToken] = useState(null);
  const [user, setUser] = useState(null);

  const getPushTokenUser = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/user/profile`);
      setCurrentPushToken(data.user.expoPushToken);
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user push token:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (userToken) {
        getPushTokenUser();
      }
    }, 1500);
  }, [userToken]);

  useEffect(() => {
    const setupPushNotifications = async () => {
      if (userToken !== null) {
        await registerForPushNotificationsAsync(BASE_URL, currentPushToken);
      }
    };

    setupPushNotifications();
  }, [userToken, currentPushToken]);

  if (isLoading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        {userToken !== null ? <DrawerNavigation /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppNav;
