import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppNav from "./navigation/AppNav";
import "expo-dev-client";


export default function App() {
  return (
    <AuthProvider>
      <AppNav></AppNav>
    </AuthProvider>
  );
}
