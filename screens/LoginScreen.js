import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Button, Snackbar } from "react-native-paper";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const { login, googleLogin } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (e) {
      console.error(`Login error: ${e}`);
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/BOVO_logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome Back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
        Login
      </Button>

      <Button
        mode="outlined"
        style={styles.googleButton}
        icon="google"
        onPress={googleLogin}
      >
        Continue with Google
      </Button>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity>
          <Text
            style={styles.signUpLink}
            onPress={() => navigation.navigate("Register")}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Wrong Email or Password
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#3498db",
    fontSize: 14,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#3498db",
    paddingVertical: 10,
    borderRadius: 8,
  },
  googleButton: {
    width: "100%",
    marginTop: 20,
    borderColor: "#DB4437",
    borderWidth: 1,
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
  },
  signUpLink: {
    color: "#3498db",
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});
