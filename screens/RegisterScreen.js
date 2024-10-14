import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { Button, Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const navigation = useNavigation();

  const handleProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.uri);
    }
  };

  const handleSignUp = () => {
    console.log("Sign Up Pressed");
    // Add sign-up logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      {/* Profile Picture */}
      <TouchableOpacity onPress={handleProfilePicture}>
        {profilePicture ? (
          <Avatar.Image source={{ uri: profilePicture }} size={100} />
        ) : (
          <Avatar.Icon size={100} icon="camera" />
        )}
      </TouchableOpacity>

      {/* Form Fields */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Sign Up Button */}
      <Button
        mode="contained"
        onPress={handleSignUp}
        style={styles.signUpButton}
      >
        Sign Up
      </Button>

      {/* Continue with Google Button */}
      <Button
        mode="outlined"
        style={styles.googleButton}
        icon="google"
        onPress={() => console.log("Continue with Google pressed")}
      >
        Continue with Google
      </Button>

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.signInLink} onPress={() => navigation.navigate("Login")}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 50, // Extra padding for scrolling
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
  signUpButton: {
    width: "100%",
    backgroundColor: "#3498db",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20, // Space between buttons
  },
  googleButton: {
    width: "100%",
    borderColor: "#DB4437",
    borderWidth: 1,
  },
  signInContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 50, // Extra space at bottom
  },
  signInText: {
    fontSize: 16,
  },
  signInLink: {
    color: "#3498db",
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});
