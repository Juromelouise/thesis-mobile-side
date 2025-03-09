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
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { API_URL, BASE_URL } from "../../assets/common/config";
import axios from "axios";
import { setImageUpload } from "../../utils/formData";
import { useNavigation } from "@react-navigation/native";
import { validateReportForm } from "../../utils/formValidation";
import PictureModal from "../../utils/pictureModal";
import * as FileSystem from "expo-file-system"
import * as ImageManipulator from "expo-image-manipulator";

export default function ReportScreen() {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [plateError, setPlateError] = useState("");
  const [imagesError, setImagesError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  const navigation = useNavigation();

  const showModal = (message, index) => {
    setModalMessage(message);
    setModalVisible(true);
    setCurrentImageIndex(index);
  };

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Resize and compress the image
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 950 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[currentImageIndex] = manipulatedImage.uri;
        return updatedImages;
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

  const pickImageAndUpload = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [8, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      try {
        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          type: "image/jpg",
          name: "plate_number.jpg",
        });
        setLoading(true);

        const response = await axios.post(`${API_URL}/alpr`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setPlate(response.data.results[0].detected_plate);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async () => {
    const { valid, errors } = validateReportForm(description, address, plate, images);
    setDescriptionError(errors.descriptionError);
    setAddressError(errors.addressError);
    setPlateError(errors.plateError);
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
    formData.append("plateNumber", plate);
    image.map((imag) => {
      formData.append("images", imag);
    });

    try {
      await axios.post(`${BASE_URL}/report/post/report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAddress("");
      setDescription("");
      setPlate("");
      setImages([]);
      setLoading(false);
      navigation.navigate("Home");
    } catch (error) {
      setLoading(false);
      console.error("Error on reportScreen:", error);
      navigate.navigate("ReportScreen");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.reportSection}>
          <Text style={styles.reportText}>Report</Text>

          <View style={styles.imagesContainer}>
            <TouchableOpacity
              style={[styles.imagePlaceholder, styles.largeImagePlaceholder]}
              onPress={() => showModal("The first picture should be wide.", 0)}
            >
              {images[0] ? (
                <Image source={{ uri: images[0] }} style={styles.image} />
              ) : (
                <Ionicons name="camera" size={40} color="#888" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={() => showModal("The second picture should be normal but should show the plate number of the vehicle.", 1)}
            >
              {images[1] ? (
                <Image source={{ uri: images[1] }} style={styles.image} />
              ) : (
                <Ionicons name="camera" size={40} color="#888" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={() => showModal("The third picture should be a close-up of the plate number.", 2)}
            >
              {images[2] ? (
                <Image source={{ uri: images[2] }} style={styles.image} />
              ) : (
                <Ionicons name="camera" size={40} color="#888" />
              )}
            </TouchableOpacity>
          </View>
          {imagesError && <Text style={styles.errorText}>{imagesError}</Text>}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Plate Number"
              placeholderTextColor="#aaa"
              value={plate}
              onChangeText={setPlate}
            />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={pickImageAndUpload}
            >
              <Ionicons name="camera" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          {plateError && <Text style={styles.errorText}>{plateError}</Text>}

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

      <PictureModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCloseAndOpenCamera={openCamera}
        message={modalMessage}
      />
    </SafeAreaView>
  );
}

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
    flexWrap: "wrap",
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
    marginBottom: 10,
  },
  largeImagePlaceholder: {
    width: "100%",
    height: 200,
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
  cameraButton: {
    marginLeft: 10,
    backgroundColor: "#6e44ff",
    padding: 10,
    borderRadius: 10,
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