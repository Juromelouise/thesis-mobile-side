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
import ApproveObstruction from "../screens/Admin/ApproveObstruction";
import AnnouncementsScreen from "../screens/AnnouncementsScreen";
import ViewAnnouncementScreen from "../screens/ViewAnnouncementScreen";
import ViewReportScreen from "../screens/ViewReportScreen";
import StreetScreen from "../screens/Maps/StreetScreen";
import ViewApprovedObstruction from "../screens/Admin/ViewApprovedObstruction";
import EditReportScreen from "../screens/Report/EditReportScreen";
import EditObstructionScreen from "../screens/Report/EditObstructionScreen";

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
      <Stack.Screen
        name="ApproveObstruction"
        component={ApproveObstruction}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AnnouncementsScreen"
        component={AnnouncementsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewAnnouncementScreen"
        component={ViewAnnouncementScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewReportScreen"
        component={ViewReportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StreetScreen"
        component={StreetScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewApprovedObstruction"
        component={ViewApprovedObstruction}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditReportScreen"
        component={EditReportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditObstructionScreen"
        component={EditObstructionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
