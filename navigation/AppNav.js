import { View, ActivityIndicator } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import DrawerNavigation from "./DrawerNavigation";

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return <>{userToken !== null ? <DrawerNavigation /> : <AuthStack />}</>;
};

export default AppNav;
