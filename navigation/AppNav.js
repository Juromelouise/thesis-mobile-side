import { View, ActivityIndicator, StyleSheet } from "react-native";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import DrawerNavigation from "./DrawerNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./RootNav";
import { registerForPushNotificationsAsync } from "../utils/Notification";
import { BASE_URL } from "../assets/common/config";

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  useEffect(() => {
    const setupPushNotifications = async () => {
      if (userToken !== null) {
        await registerForPushNotificationsAsync(BASE_URL);
      }
    };

    setupPushNotifications();
  }, [userToken]);

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
