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
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { API_URL, BASE_URL } from "../../assets/common/config";
import axios from "axios";
import { setImageUpload } from "../../utils/formData";
import { useNavigation } from "@react-navigation/native";
import { validateReportForm } from "../../utils/formValidation";
import * as ImageManipulator from "expo-image-manipulator";
import { Picker } from "@react-native-picker/picker";

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
  const [geocode, setGeocode] = useState(null);

  const navigation = useNavigation();

  const streetOptions = [
    "A. Ricarte Street",
    "A. Santos Street",
    "Accord Road",
    "Adelfa 2 Street",
    "Adelfa Street",
    "Albutra Street",
    "Alley 4C",
    "Alley 4C Street",
    "Alley Street",
    "Almaciga",
    "Almond",
    "Anchor Street",
    "Andres Bonifacio Avenue",
    "Antonio Luna Avenue",
    "Arca Boulevard",
    "Avocado",
    "Avocado Road",
    "B. Valdez Street",
    "BLC Road",
    "Baao Street",
    "Bagsakan Road",
    "Balatan Street",
    "Balatong Street",
    "Bato Street",
    "Bayabas Street",
    "Bayani Road",
    "Bermuda",
    "Bougainvillea",
    "C-5 Centennial Village Service Road",
    "C. Duque Street",
    "C. Romulo",
    "C. Romulo Street",
    "C. Yap Street",
    "CRB Road",
    "Cabuyao Street",
    "Calachuchi",
    "Campupot Street",
    "Champaca Extension",
    "Champaca Street",
    "Coconut",
    "Coconut Extension",
    "Colonel Bravo Street",
    "Cucumber Road",
    "Daang Hari",
    "Daisy",
    "Daisy Street",
    "Dalandan Street",
    "Dalanghita Street",
    "Dama de Noche",
    "Damong Maria Street",
    "Dayap Street",
    "Del Pilar Street",
    "Diego Silang Street",
    "Dita Street",
    "Duhat",
    "Duhat Street",
    "E. Adevoso Street",
    "E. Aguinaldo Avenue",
    "E. Balao Street",
    "East Union Drive",
    "Electronics Avenue",
    "Eucalyptus Street",
    "Evangelista Street",
    "F. Dagohoy Street",
    "F. Segundo Street",
    "F. Ver Street",
    "FTI Road",
    "G. Francisco Street",
    "G. Juliano Avenue",
    "Geronimo Street",
    "Guijo",
    "Gulaman Street",
    "Gumamela",
    "Gumamela Street",
    "Ilang-ilang",
    "Ipil",
    "Iriga Street",
    "J. Vargas Street",
    "J. de los Reyes Street",
    "Jalandoni Street",
    "Junction Street",
    "Kablini Street",
    "Kakaw Street",
    "Kakawati Street",
    "Kalachuchi Street",
    "Kalamansi Street",
    "Kalantas",
    "Kalantas Street",
    "Karangalan Road",
    "Kasoy Street",
    "LRT Sunflower Street",
    "La Union Street",
    "Langka Road",
    "Lanting Street",
    "Lao Street",
    "Lawton Avenue",
    "Libas Street",
    "Lieutenant General Alfonso Arellano Avenue",
    "Link Street",
    "Llanera Street",
    "M. Cabal Street",
    "M. Castañeda Street",
    "M. Peralta Street",
    "M. Tinio Street",
    "MDC Road",
    "Macopa",
    "Magbanua Street",
    "Maharlika Road",
    "Mais Street",
    "Makabuhay Street",
    "Malvar Street",
    "Manggahan Street",
    "Mango Road",
    "Manuel Roxas Avenue",
    "Manzanilla Street",
    "Military Shrine Service Road",
    "Molave",
    "Nabua Street",
    "Nexus Street",
    "Orchid",
    "P. Garcia Street",
    "P. Ledesma Street",
    "Palayan Road",
    "Palo Maria Street",
    "Pangasinan Street",
    "Pulse Street",
    "R. Atienza Street",
    "R. Kangleon Street",
    "R. Magsaysay Street",
    "R. Papa",
    "R. Papa Street",
    "Radian Street",
    "Rambutan Road",
    "Rhodora",
    "Romulo",
    "Rosal",
    "S. Aquino Street",
    "SSB Road",
    "Sahing Street",
    "Saint Luke Street",
    "Sales Road",
    "Salong Street",
    "Sambong Street",
    "Sampaguita Street",
    "Sampaloc Street",
    "San Francisco Street",
    "Santan",
    "Simeon Ola Avenue",
    "South Union Drive",
    "Sunflower Street",
    "Sync Street",
    "T. Bautista Street",
    "T. Mascardo Street",
    "Talipapa Street",
    "Tandem Road",
    "Trias Street",
    "Upper McKinley Road",
    "V. Osias Street",
    "Velasco Street",
    "Veterans Road",
    "Vicente Lukban Street",
    "Waling-waling",
    "West Union Drive",
    "Yakal",
    "Yengco Street",
  ];

  const openCamera = async (index) => {
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
        updatedImages[index] = manipulatedImage.uri;
        return updatedImages;
      });
    }
  };

  const showImageAlert = (message, index) => {
    Alert.alert(
      "Image Selection",
      message,
      [
        {
          text: "Open Camera",
          onPress: () => openCamera(index),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  // const getLocation = async () => {
  //   setLoading(true);
  //   try {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       alert("Permission to access location was denied");
  //       setLoading(false);
  //       return;
  //     }

  //     let loc = await Location.getCurrentPositionAsync({
  //       accuracy: Location.Accuracy.High,
  //     });

  //     setGeocode({
  //       latitude: loc.coords.latitude,
  //       longitude: loc.coords.longitude,
  //     });

  //     const reverseGeocode = await Location.reverseGeocodeAsync({
  //       latitude: loc.coords.latitude,
  //       longitude: loc.coords.longitude,
  //     });

  //     if (reverseGeocode.length > 0) {
  //       const { street, city, region } = reverseGeocode[0];
  //       setAddress(`${street}, ${city}, ${region}`);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching location:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredStreets, setFilteredStreets] = useState(streetOptions);

  const openSearchModal = () => {
    setSearchText("");
    setFilteredStreets(streetOptions);
    setSearchModalVisible(true);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    setFilteredStreets(
      streetOptions.filter((street) =>
        street.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const handleSelectStreet = (street) => {
    setAddress(street);
    setSearchModalVisible(false);
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
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/user/profile`);
      setLoading(false);
      if (
        !data.user.address ||
        !data.user.phoneNumber ||
        !data.user.firstName ||
        !data.user.lastName
      ) {
        Alert.alert(
          "Error",
          "You must provide address, phone number, first name, and last name before submitting a report.",
          [
            { text: "OK" },
            {
              text: "Go to Profile",
              onPress: () => navigation.navigate("ProfileScreen"),
            },
          ]
        );

        return;
      }
    } catch (error) {
      setLoading(false);
      console.error("Error on Fetching Data:", error);
      navigation.navigate("ReportScreen");
    }
    const { valid, errors } = validateReportForm(description, address, images);
    setDescriptionError(errors.descriptionError);
    setAddressError(errors.addressError);
    setPlateError(errors.plateError);
    setImagesError(errors.imagesError);

    if (!valid) {
      return;
    }

    setLoading(true);

    const userConfirmed = await new Promise((resolve) => {
      Alert.alert(
        "Confirmation",
        "Do you want to post your report on newsfeed?",
        [
          { text: "Yes", onPress: () => resolve(true) },
          { text: "No", onPress: () => resolve(false) },
        ],
        { cancelable: false }
      );
    });

    console.log("User confirmed:", userConfirmed);

    const formData = new FormData();
    let image = [];
    image = await setImageUpload(images);
    formData.append("description", description);
    formData.append("location", address);
    formData.append("plateNumber", plate);
    formData.append("postIt", userConfirmed);
    // formData.append("geocodeData", JSON.stringify(geocode));
    image.map((imag) => {
      formData.append("images", imag);
    });

    try {
      await axios.post(`${BASE_URL}/report/post/report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // setAddress("");
      // setDescription("");
      // setPlate("");
      // setImages([]);
      setDescriptionError("");
      setAddressError("");
      setPlateError("");
      setImagesError("");
      setGeocode(null);
      setLoading(false);
      navigation.navigate("Home");
    } catch (error) {
      setLoading(false);
      console.error("Error on reportScreen:", error);
      navigation.navigate("ReportScreen");
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
              onPress={() =>
                showImageAlert("The first picture should be wide.", 0)
              }
            >
              {images[0] ? (
                <Image source={{ uri: images[0] }} style={styles.image} />
              ) : (
                <Ionicons name="camera" size={40} color="#888" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={() =>
                showImageAlert(
                  "The second picture should be normal but should show the plate number of the vehicle.",
                  1
                )
              }
            >
              {images[1] ? (
                <Image source={{ uri: images[1] }} style={styles.image} />
              ) : (
                <Ionicons name="camera" size={40} color="#888" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={() =>
                showImageAlert(
                  "The third picture should be a close-up of the plate number.",
                  2
                )
              }
            >
              {images[2] ? (
                <Image source={{ uri: images[2] }} style={styles.image} />
              ) : (
                <Ionicons name="camera" size={40} color="#888" />
              )}
            </TouchableOpacity>
          </View>
          {imagesError && <Text style={styles.errorText}>{imagesError}</Text>}

          {!plate ? (
            <TouchableOpacity
              style={[
                styles.cameraButton,
                {
                  alignSelf: "flex-start",
                  marginBottom: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#6e44ff",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 10,
                },
              ]}
              onPress={pickImageAndUpload}
            >
              <Ionicons name="camera" size={24} color="#fff" />
              <Text
                style={{ color: "#fff", marginLeft: 8, fontWeight: "bold" }}
              >
                Add Plate Number
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.inputRow,
                { marginBottom: 20, alignItems: "center" },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  { flex: 1, marginRight: 10, backgroundColor: "#f5f5f5" },
                ]}
                placeholder="Plate Number"
                placeholderTextColor="#aaa"
                value={plate}
                onChangeText={setPlate}
              />
              <TouchableOpacity
                style={[
                  styles.cameraButton,
                  {
                    backgroundColor: "#6e44ff",
                    padding: 10,
                    borderRadius: 10,
                  },
                ]}
                onPress={pickImageAndUpload}
              >
                <Ionicons name="camera" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                justifyContent: "center",
                height: 50,
                paddingHorizontal: 10,
              }}
              onPress={openSearchModal}
              activeOpacity={0.8}
            >
              <Text style={{ color: address ? "#333" : "#aaa", fontSize: 16 }}>
                {address || "Select Location"}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={searchModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setSearchModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  width: "90%",
                  maxHeight: "70%",
                  padding: 16,
                }}
              >
                <TextInput
                  placeholder="Search street..."
                  value={searchText}
                  onChangeText={handleSearch}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                  }}
                  autoFocus
                />
                <FlatList
                  data={filteredStreets}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectStreet(item)}
                      style={{
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "#eee",
                      }}
                    >
                      <Text style={{ fontSize: 16, color: "#333" }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="handled"
                />
                <TouchableOpacity
                  onPress={() => setSearchModalVisible(false)}
                  style={{
                    marginTop: 10,
                    alignSelf: "flex-end",
                    padding: 8,
                  }}
                >
                  <Text style={{ color: "#6e44ff", fontWeight: "bold" }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {addressError && <Text style={styles.errorText}>{addressError}</Text>}

          <TextInput
            style={[styles.input, styles.reasonInput]}
            placeholder="Complaint"
            placeholderTextColor="#aaa"
            multiline
            value={description}
            onChangeText={setDescription}
            numberOfLines={4}
          />
          {descriptionError && (
            <Text style={styles.errorText}>{descriptionError}</Text>
          )}

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
