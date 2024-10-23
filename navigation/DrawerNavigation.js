import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navigator from "./Navigator";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.headerText}>Menu</Text>
      </View>

      {/* Home */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
        }}
        style={styles.drawerButton}
      >
        <Text style={styles.drawerButtonText}>Home</Text>
      </TouchableOpacity>

      {/*Profile*/}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Profile");
        }}
        style={styles.drawerButton}
      >
        <Text style={styles.drawerButtonText}>Profile</Text>
      </TouchableOpacity>

      {/* Report */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Report");
        }}
        style={styles.drawerButton}
      >
        <Text style={styles.drawerButtonText}>Report</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={() => {
          logout();
        }}
        style={[styles.drawerButton, styles.logoutButton]}
      >
        <Text style={[styles.drawerButtonText, styles.logoutButtonText]}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const DrawerNavigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Home"
          component={Navigator}
          initialParams={{ screen: "HomeScreen" }}
        />
        <Drawer.Screen
          name="Report"
          component={Navigator}
          initialParams={{ screen: "ReportScreen" }}
        />
        <Drawer.Screen
          name="Profile"
          component={Navigator}
          initialParams={{ screen: "ProfileScreen" }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 60, // Top padding to fix spacing at the top
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  drawerHeader: {
    marginBottom: 40,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  drawerButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  drawerButtonText: {
    fontSize: 18,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ff6b6b",
  },
  logoutButtonText: {
    color: "#fff",
  },
});
