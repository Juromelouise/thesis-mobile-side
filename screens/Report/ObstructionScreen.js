import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { setImageUpload } from "../../utils/formData";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { BASE_URL } from "../../assets/common/config";
import axios from "axios";
import { validateObsForm } from "../../utils/formValidation";

const ObstructionScreen = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [imagesError, setImagesError] = useState("");
  const [geocode, setGeocode] = useState(null);

  const navigation = useNavigation();

  const pickImage = async (index) => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[index] = result.assets[0].uri;
        console.log("Updated images:", updatedImages);
        return updatedImages.slice(0, 2);
      });
    }
  };

  const getLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

       setGeocode({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const { street, city, region } = reverseGeocode[0];
        setAddress(`${street}, ${city}, ${region}`);
        console.log("Address:", `${street}, ${city}, ${region}`);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const { valid, errors } = validateObsForm(description, address, images);
    setDescriptionError(errors.descriptionError);
    setAddressError(errors.addressError);
    setImagesError(errors.imagesError);

    if (!valid) {
      return;
    }

    setLoading(true);

    const formData = new FormData();

    let image = [];
    image = await setImageUpload(images);
    formData.append("description", description);
    formData.append("location", address);
    formData.append("geocodeData", JSON.stringify(geocode));
    image.map((imag) => {
      formData.append("images", imag);
    });

    try {
      await axios.post(`${BASE_URL}/report/post/obstruction`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAddress("");
      setDescription("");
      setImages([]);
      setLoading(false);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error on reportScreen:", error);
      setLoading(false);
    }
  };
  console.log("Images:", images);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.reportSection}>
          <Text style={styles.reportText}>Report</Text>

          <View style={styles.imagesContainer}>
            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={() => pickImage(0)}
            >
              {images[0] ? (
                <Image source={{ uri: images[0] }} style={styles.image} />
              ) : (
                <Ionicons name="camera" size={40} color="#888" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={() => pickImage(1)}
            >
              {images[1] ? (
                <Image source={{ uri: images[1] }} style={styles.image} />
              ) : (
                <Ionicons name="camera" size={40} color="#888" />
              )}
            </TouchableOpacity>
          </View>
          {imagesError && <Text style={styles.errorText}>{imagesError}</Text>}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="#aaa"
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getLocation}
            >
              <MaterialIcons name="my-location" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          {addressError && <Text style={styles.errorText}>{addressError}</Text>}

          <TextInput
            style={[styles.input, styles.reasonInput]}
            placeholder="Reason"
            placeholderTextColor="#aaa"
            multiline
            value={description}
            onChangeText={setDescription}
            numberOfLines={4}
          />
          {descriptionError && <Text style={styles.errorText}>{descriptionError}</Text>}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6e44ff" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ObstructionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  reportSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  reportText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: "48%",
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#333",
  },
  locationButton: {
    marginLeft: 10,
    backgroundColor: "#6e44ff",
    padding: 10,
    borderRadius: 10,
  },
  reasonInput: {
    height: 100,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#333",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#6e44ff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    marginBottom: 10,
  },
});