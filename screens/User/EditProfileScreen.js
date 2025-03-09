import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";

const EditProfileScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [address, setAddress] = useState(user.address || "");
  const [avatar1, setAvatar] = useState(user.avatar.url || null);
  const [avatar2, setAvatar2] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar2(result.assets[0].uri);
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    if (avatar2) {
      formData.append("avatar", {
        uri: avatar2,
        type: "image/jpeg",
        name: avatar2.split("/").pop(),
      });
    }

    try {
      await axios.put(`${BASE_URL}/user/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.navigate("ProfileScreen"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {avatar1 ? (
          <Image source={{ uri: avatar1 }} style={styles.avatar} />
        ) : (
          <Ionicons name="person-circle-outline" size={100} color="#ccc" />
        )}
      </TouchableOpacity>
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
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
      ) : (
        <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    width: 100,
    height: 100,
    backgroundColor: "#e1e1e1",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
});