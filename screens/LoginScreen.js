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
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarData, setSnackbarData] = useState({
    visible: false,
    message: "",
    type: "error", // 'error' or 'success'
  });
  const { login, googleLogin } = useContext(AuthContext);
  const navigation = useNavigation();

  const showSnackbar = (message, type = "error") => {
    setSnackbarData({
      visible: true,
      message,
      type,
    });
  };

  const hideSnackbar = () => {
    setSnackbarData(prev => ({ ...prev, visible: false }));
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      showSnackbar("Login successful!", "success");
    } catch (e) {
      console.error(`Login error: ${e}`);
      showSnackbar("Wrong email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      showSnackbar("Google login successful!", "success");
    } catch (e) {
      console.error(`Google login error: ${e}`);
      showSnackbar("Google login failed");
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
      
      <TouchableOpacity 
        style={styles.forgotPassword}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.loginButton}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        Login
      </Button>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <Button
        mode="outlined"
        style={styles.googleButton}
        labelStyle={[styles.buttonLabel, styles.googleButtonLabel]}
        contentStyle={styles.buttonContent}
        icon="google"
        onPress={handleGoogleLogin}
      >
        Continue with Google
      </Button>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signUpLink}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={snackbarData.visible}
        onDismiss={hideSnackbar}
        duration={3000}
        style={[
          styles.snackbar,
          snackbarData.type === "success" 
            ? styles.successSnackbar 
            : styles.errorSnackbar
        ]}
        action={{
          label: "Dismiss",
          onPress: hideSnackbar,
        }}
      >
        {snackbarData.message}
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
    padding: 24,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    color: '#333',
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#4361ee",
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#4361ee",
    borderRadius: 12,
    height: 56,
    shadowColor: "#4361ee",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  googleButton: {
    width: "100%",
    borderRadius: 12,
    height: 56,
    borderColor: "#DB4437",
    borderWidth: 1,
    marginTop: 16,
  },
  googleButtonLabel: {
    color: "#DB4437",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContent: {
    height: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 24,
  },
  signUpText: {
    fontSize: 16,
    color: '#666',
  },
  signUpLink: {
    color: "#4361ee",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  snackbar: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  errorSnackbar: {
    backgroundColor: '#d32f2f', // Red for errors
  },
  successSnackbar: {
    backgroundColor: '#388e3c', // Green for success
  },
});