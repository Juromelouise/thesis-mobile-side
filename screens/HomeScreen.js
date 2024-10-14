import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";

const HomeScreen = () => {
  const { logout, isLoading } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <Button
        mode="contained"
        onPress={logout}
        disabled={isLoading} // Disable button while logging out
        loading={isLoading} // Show a loading indicator on the button
      >
        Logout
      </Button>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
