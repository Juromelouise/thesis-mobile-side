import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppNav from "./navigation/AppNav";
import { PaperProvider } from "react-native-paper";
import "expo-dev-client";

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <AppNav />
      </PaperProvider>
    </AuthProvider>
  );
}
