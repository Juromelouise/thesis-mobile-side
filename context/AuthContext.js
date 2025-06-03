import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../assets/common/config";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState({
    given_name: "",
    family_name: "",
    email: "",
    picture: "",
  });
  
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setUserToken(null);
        setIsLoading(false);
        return;
      }
      axios.defaults.headers.common["Authorization"] = token;
      const { data } = await axios.get(`${BASE_URL}/user/profile`);
      if (data.user) {
        setUserToken(token);
      } else {
        setUserToken(null);
        await AsyncStorage.removeItem("userToken");
      }
      setIsLoading(false);
    } catch (e) {
      console.log(
        `isLogged in error ${e?.response?.data?.message || e.message}`
      );
      setUserToken(null);
      await AsyncStorage.removeItem("userToken");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
    GoogleSignin.configure({
      webClientId:
        "642593357289-i58a7qjhh4fiooamvo54ubclik39eqbf.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, [userToken]);

  const login = (email, password) => {
    setIsLoading(true);
    axios
      .post(`${BASE_URL}/user/login`, {
        email,
        password,
      })
      .then((res) => {
        setUserToken(res.data.token);
        AsyncStorage.setItem("userToken", res.data.token);
      })
      .catch((e) => {
        console.error(`Login error ${e}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const register = async (
    firstName,
    lastName,
    phoneNumber,
    address,
    email,
    password,
    profilePicture
  ) => {
    setIsLoading(true);
    try {
      const userData = {
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        password,
      };

      const formData = new FormData();
      for (const key in userData) {
        formData.append(key, userData[key]);
      }

      if (profilePicture) {
        const fileUri = profilePicture;
        const fileName = fileUri.split("/").pop();
        const fileType = fileName.split(".").pop();

        formData.append("avatar", {
          uri: fileUri,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      const res = await axios.post(`${BASE_URL}/user/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await AsyncStorage.setItem("userToken", res.data.token);
      setIsLoading(false);
    } catch (error) {
      console.error("Error during sign up:", error.message);
      setIsLoading(false);
    }
  };

  const googleLogin = () => {
    setIsLoading(true);

    GoogleSignin.hasPlayServices()
      .then(() => {
        GoogleSignin.signIn()
          .then(({ data }) => {
            const googleCredential = GoogleAuthProvider.credential(
              data.idToken
            );
            const authInstance = getAuth();

            return signInWithCredential(authInstance, googleCredential).then(
              (userCredential) => {
                const user = {
                  given_name: data.user.givenName,
                  family_name: data.user.familyName,
                  email: data.user.email,
                  picture: data.user.photo,
                };
                setUserData(user);
                return axios.post(`${BASE_URL}/auth/mobile/auth`, user);
              }
            );
          })
          .then((response) => {
            return AsyncStorage.setItem("userToken", response.data.token).then(
              () => {
                setUserToken(response.data.token);
              }
            );
          })
          .catch((error) => {
            GoogleSignin.signOut();
            if (error.response) {
              console.log("Google login error:", error.response.data);
            } else if (error.request) {
              console.log(
                "Google login error: No response received",
                error.request
              );
            } else {
              console.log("Google login error:", error.message);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((e) => {
        GoogleSignin.signOut();
        console.log(e);
      });
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
      AsyncStorage.removeItem("user");
      setUserToken(null);
      GoogleSignin.signOut();
      // GoogleSignin.revokeAccess();
      console.log("User logged out successfully.");
    } catch (error) {
      console.log(`Logout error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // setTimeout(() => {
  //   isLoggedIn();
  // }, 1500);

  return (
    <AuthContext.Provider
      value={{ login, logout, googleLogin, isLoading, userToken, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
