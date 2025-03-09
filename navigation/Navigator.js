import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../screens/HomeScreen";
import ReportScreen from "../screens/Report/ReportScreen";
import "react-native-gesture-handler";
import ProfileScreen from "../screens/User/ProfileScreen";
import ObstructionScreen from "../screens/Report/ObstructionScreen";
import ReportListScreen from "../screens/Report/ReportListScreen";
import DetailReportScreen from "../screens/Report/DetailReportScreen";
import DetailObstructionScreen from "../screens/Report/DetailObstructionScreen";
import ApproveReports from "../screens/Admin/ApproveReports";
import ViewApprovedReport from "../screens/Admin/ViewApprovedReport";
import EditProfileScreen from "../screens/User/EditProfileScreen";

const Navigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ObstructionScreen"
        component={ObstructionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ReportListScreen"
        component={ReportListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailReportScreen"
        component={DetailReportScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="DetailObstructionScreen"
        component={DetailObstructionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ApproveReports"
        component={ApproveReports}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewApprovedReport"
        component={ViewApprovedReport}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
