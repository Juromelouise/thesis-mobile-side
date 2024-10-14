import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../config";
import * as AuthSession from "expo-auth-session";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const login = (email, password) => {
    setIsLoading(true);
    axios
      .post(`${BASE_URL}/user/login`, {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        setUserToken(res.data.token);
        AsyncStorage.setItem("userToken", res.data.token);
      })
      .catch((e) => {
        console.log(`Login error ${e}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const googleLogin = async () => {
    setIsLoading(true);
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
    const authUrl = `${BASE_URL}/auth/google?redirect_uri=${redirectUri}`;

    let result = await AuthSession.startAsync({ authUrl });

    if (result.type === "success") {
      console.log(result.params);
      // Handle token reception and storage
      AsyncStorage.setItem("userToken", result.params.token);
      setUserToken(result.params.token);
    } else {
      console.log("Login failed");
    }
    setIsLoading(false);
  };

  const logout = () => {
    try {
      setIsLoading(true);
      if (!userToken) {
        console.log("No user is logged in.");
        return;
      }
      axios.get(`${BASE_URL}/user/logout`);
      AsyncStorage.removeItem("userToken");
      setUserToken(null);
      console.log("User logged out successfully.");
    } catch (error) {
      console.log(`Logout error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
      setIsLoading(false);
    } catch (e) {
      console.log(`isLogged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, googleLogin, isLoading, userToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
