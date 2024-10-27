import { View, ActivityIndicator, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import DrawerNavigation from "./DrawerNavigation";

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <>{userToken !== null ? <DrawerNavigation /> : <AuthStack />}</>;
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Translucent background
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppNav;
