import { View, ActivityIndicator } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import HomeScreen from "../screens/HomeScreen";

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken !== null ? <HomeScreen /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNav;
