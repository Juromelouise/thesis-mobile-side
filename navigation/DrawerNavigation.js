import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useContext, useState, useCallback } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { MaterialIcons, FontAwesome5 } from "react-native-vector-icons";
import { AuthContext } from "../context/AuthContext";
import Navigator from "./Navigator";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "../assets/common/config";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      axios
        .get(`${BASE_URL}/user/profile`)
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error("Error fetching profile data: ", error);
        });
    }, [])
  );

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Image
          source={require("../assets/BOVO_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>BOVO</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Home */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home");
          }}
          style={styles.drawerButton}
        >
          <Icon name="home" size={20} color="#333" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Home</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile");
          }}
          style={styles.drawerButton}
        >
          <Icon name="user" size={20} color="#333" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Announcements");
          }}
          style={styles.drawerButton}
        >
          <MaterialIcon
            name="announcement"
            size={20}
            color="#333"
            style={styles.icon}
          />
          <Text style={styles.drawerButtonText}>Announcements</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Street Map");
          }}
          style={styles.drawerButton}
        >
          <Icon name="map" size={20} color="#333" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Street Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("List");
          }}
          style={styles.drawerButton}
        >
          <Icon name="th-list" size={20} color="#333" style={styles.icon} />
          <Text style={styles.drawerButtonText}>List of Reports</Text>
        </TouchableOpacity>

        {/* Report */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Illegal Parking");
          }}
          style={styles.drawerButton}
        >
          <Icon name="file" size={20} color="#333" style={styles.icon} />
          <Text style={styles.drawerButtonText}>Submit a Report</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
        onPress={() => setIsReportDropdownOpen(!isReportDropdownOpen)}
        style={styles.drawerButton}
      >
        <Icon name="file" size={20} color="#333" style={styles.icon} />
        <Text style={styles.drawerButtonText}>Report</Text>
        <Icon
          name={isReportDropdownOpen ? "angle-up" : "angle-down"}
          size={16}
          color="#333"
          style={styles.dropdownIcon}
        />
      </TouchableOpacity> */}

        {/* Dropdown for Report options */}
        {/* {isReportDropdownOpen && (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Illegal Parking");
            }}
            style={styles.dropdownButton}
          >
            <Icon name="ban" size={16} color="#333" style={styles.icon} />
            <Text style={styles.dropdownButtonText}>
              Report Illegal Parking
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Obstruction");
            }}
            style={styles.dropdownButton}
          >
            <Icon name="road" size={16} color="#333" style={styles.icon} />
            <Text style={styles.dropdownButtonText}>Report Obstruction</Text>
          </TouchableOpacity>
        </View>
      )} */}

        {/* Admin */}
        {/* {user && (user.role === "admin" || user.role === "superadmin") && (
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Approve Reports");
              }}
              style={styles.drawerButton}
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={20}
                color="#333"
                style={styles.icon}
              />
              <Text style={styles.drawerButtonText}>Admin</Text>
            </TouchableOpacity>
          </>
        )} */}
        {user && (user.role === "admin" || user.role === "superadmin") && (
        <>
          <TouchableOpacity
            onPress={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
            style={styles.drawerButton}
          >
            <MaterialIcons
              name="admin-panel-settings"
              size={20}
              color="#333"
              style={styles.icon}
            />
            <Text style={styles.drawerButtonText}>Admin</Text>
            <Icon
              name={isAdminDropdownOpen ? "angle-up" : "angle-down"}
              size={16}
              color="#333"
              style={styles.dropdownIcon}
            />
          </TouchableOpacity>
        </>
      )}

        {/* Dropdown for Admin options */}
        {isAdminDropdownOpen && (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Approve Reports");
            }}
            style={styles.dropdownButton}
          >
            <Icon name="file-text" size={16} color="#333" style={styles.icon} />
            <Text style={styles.dropdownButtonText}>All Approve Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Approve Reports Location");
            }}
            style={styles.dropdownButton}
          >
            <FontAwesome5 name="map-marker-alt" size={16} color="#333" style={styles.icon} />
            <Text style={styles.dropdownButtonText}>Approve Locations</Text>
          </TouchableOpacity>
        </View>
      )}

        {/* Logout */}
        <TouchableOpacity
          onPress={() => {
            logout();
          }}
          style={[styles.drawerButton, styles.logoutButton]}
        >
          <Icon name="sign-out" size={20} color="#fff" style={styles.icon} />
          <Text style={[styles.drawerButtonText, styles.logoutButtonText]}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={Navigator}
        initialParams={{ screen: "HomeScreen" }}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="Illegal Parking"
        component={Navigator}
        initialParams={{ screen: "ReportScreen" }}
        options={{ title: "Report Illegal Parking" }}
      />
      <Drawer.Screen
        name="Obstruction"
        component={Navigator}
        initialParams={{ screen: "ObstructionScreen" }}
        options={{ title: "Report Obstruction" }}
      />
      <Drawer.Screen
        name="Profile"
        component={Navigator}
        initialParams={{ screen: "ProfileScreen" }}
        options={{ title: "Profile" }}
      />
      <Drawer.Screen
        name="List"
        component={Navigator}
        initialParams={{ screen: "ReportListScreen" }}
        options={{ title: "List of Report" }}
      />

      {/* ADMIN */}
      <Drawer.Screen
        name="Approve Reports"
        component={Navigator}
        initialParams={{ screen: "ApproveReports" }}
        options={{ title: "Approve Reports" }}
      />
      <Drawer.Screen
        name="Approve Obstruction"
        component={Navigator}
        initialParams={{ screen: "ApproveObstruction" }}
        options={{ title: "Approve Obstruction" }}
      />
      <Drawer.Screen
        name="Announcements"
        component={Navigator}
        initialParams={{ screen: "AnnouncementsScreen" }}
        options={{ title: "Announcements" }}
      />
      <Drawer.Screen
        name="Street Map"
        component={Navigator}
        initialParams={{ screen: "StreetScreen" }}
        options={{ title: "Street Map" }}
      />
       <Drawer.Screen
        name="Approve Reports Location"
        component={Navigator}
        initialParams={{ screen: "ApproveReportsLocation" }}
        options={{ title: "Approve Reports Location" }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  drawerHeader: {
    marginBottom: 40,
    alignItems: "center",
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: 2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  drawerButton: {
    flexDirection: "row",
    alignItems: "center",
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
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#ff6b6b",
  },
  logoutButtonText: {
    color: "#fff",
  },
  dropdownContainer: {
    marginLeft: 40,
    marginTop: -10,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
    borderRadius: 6,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  dropdownIcon: {
    marginLeft: "auto",
  },
});
