import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppNav from "./navigation/AppNav";
import { Provider as PaperProvider } from "react-native-paper";
import "expo-dev-client";
import 'react-native-gesture-handler';
import 'react-native-reanimated'
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <AppNav />
      </PaperProvider>
    </AuthProvider>
  );
}
