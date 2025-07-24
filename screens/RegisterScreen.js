import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Button, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import mime from "mime";
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigation = useNavigation();
  const { register, googleLogin } = useContext(AuthContext);

  const handleProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await register(
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        password,
        profilePicture
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our community today</Text>
      </View>

      {/* Profile Picture */}
      <TouchableOpacity 
        onPress={handleProfilePicture}
        style={styles.avatarContainer}
      >
        {profilePicture ? (
          <Avatar.Image 
            source={{ uri: profilePicture }} 
            size={120} 
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Avatar.Icon 
              size={120} 
              icon="camera" 
              style={styles.avatarIcon}
            />
            <Text style={styles.avatarText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        <View style={styles.nameContainer}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#999"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      {/* Sign Up Button */}
      <Button
        mode="contained"
        onPress={handleSignUp}
        style={styles.signUpButton}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
        disabled={loading}
        loading={loading}
      >
        {loading ? "" : "Sign Up"}
      </Button>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Continue with Google Button */}
      <Button
        mode="outlined"
        style={styles.googleButton}
        labelStyle={[styles.buttonLabel, styles.googleButtonLabel]}
        contentStyle={styles.buttonContent}
        icon={googleLoading ? null : "google"}
        onPress={googleLogin}
        disabled={googleLoading}
        loading={googleLoading}
      >
        {googleLoading ? "" : "Continue with Google"}
      </Button>

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signInLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: 'transparent',
  },
  avatarPlaceholder: {
    alignItems: 'center',
  },
  avatarIcon: {
    backgroundColor: '#f0f0f0',
  },
  avatarText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nameInput: {
    width: '48%',
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
  signUpButton: {
    width: "100%",
    backgroundColor: "#4361ee",
    borderRadius: 12,
    height: 56,
    shadowColor: "#4361ee",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  googleButton: {
    width: "100%",
    borderRadius: 12,
    height: 56,
    borderColor: "#DB4437",
    borderWidth: 1,
    marginBottom: 24,
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
  signInContainer: {
    flexDirection: "row",
    justifyContent: 'center',
    marginTop: 16,
  },
  signInText: {
    fontSize: 16,
    color: '#666',
  },
  signInLink: {
    color: "#4361ee",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});