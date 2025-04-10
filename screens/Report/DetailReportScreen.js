import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Modal, Portal, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { BASE_URL } from "../../assets/common/config";
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { setImageUpload } from "../../utils/formData";
import { useNavigation } from "@react-navigation/native";

const DetailReportScreen = ({ route }) => {
  const [data, setData] = useState({});
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [plate, setPlate] = useState("");
  const [status, setStatus] = useState("");
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [confirmationImages, setConfirmationImages] = useState([]);
  const navigate = useNavigation();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 10 };

  const getData = async () => {
    const id = route.params.report;
    try {
      const { data } = await axios.get(`${BASE_URL}/report/admin/report/${id}`);
      setData(data.report);
      setStatus(data.report.status || "N/A");
      setDescription(data.report.original || "");
      setAddress(data.report.location || "");
      setPlate(data.report.plateNumber?.plateNumber || "");
      setConfirmationImages(data?.report?.confirmationImages || []);

      console.log("Report Data:", data.report.plateNumber.violations);

      if (
        data.report.plateNumber &&
        Array.isArray(data.report.plateNumber.violations)
      ) {
        const flattenedViolations = data.report.plateNumber.violations.flat();

        setViolations(flattenedViolations || []);
      } else {
        setViolations([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const pickImage = async () => {
    if (images.length >= 4) {
      alert("You can only add up to 4 images.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages((prevImages) => {
        const updatedImages = [...prevImages, result.assets[0].uri].slice(0, 4);
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
      allowsEditing: true,
      aspect: [8, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      try {
        const formData = new FormData();
        formData.append("imageReport", {
          uri: imageUri,
          type: "image/jpg",
          name: "plate_number.jpg",
        });

        const response = await axios.post(
          `${BASE_URL}/report/extract/text`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setPlate(response.data.extractedText);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const deleteReport = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this report?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("User canceled the delete action."),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const { data } = await axios.delete(
                `${BASE_URL}/report/delete/report/${id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              if (data.success === true) {
                alert("Report deleted successfully.");
                navigate.navigate("List");
              } else {
                alert("Failed to delete report.");
              }
            } catch (error) {
              console.error("Error deleting report:", error);
              alert(
                "An error occurred while trying to delete the report. Please try again."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = async (id) => {
    setLoading(true);
    setVisible(false);
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
      const { data } = await axios.put(
        `${BASE_URL}/report/update/report/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setData(data.report);
      setAddress("");
      setDescription("");
      setPlate("");
      setImages([]);
      alert("Updated Successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error on reportScreen:", error);
      navigate.navigate("Home");
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [route.params.report])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.reportSection}>
          <Text style={styles.reportText}>Report ID: {data?._id}</Text>

          <View style={styles.imagesContainer}>
            {data.images?.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img.url }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Confirmation Images:</Text>
          </View>
          {status === "Resolved" && confirmationImages.length > 0 && (
            <View style={styles.imagesContainer}>
              {confirmationImages.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img.url }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}

          <View style={styles.inputRow}>
            <Text style={styles.label}>Plate Number:</Text>
            <Text style={styles.input}>
              {data?.plateNumber?.plateNumber || "N/A"}
            </Text>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Violation:</Text>
            <Text style={styles.input}>
              {violations?.length > 0
                ? violations?.join(", ")
                : "No violations reported"}
            </Text>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.input}>{data?.location || "N/A"}</Text>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Description of the Report:</Text>
            <Text style={[styles.input, styles.reasonInput]}>
              {data?.original || "No description provided."}
            </Text>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.input}>{status}</Text>
          </View>
          {data && data.status === "Pending" && (
            <>
              <Button
                style={{ marginTop: 30 }}
                onPress={showModal}
                mode="contained"
              >
                Edit Report
              </Button>
              <Button
                style={{
                  marginTop: 30,
                  backgroundColor: "red",
                  color: "white",
                }}
                textColor="white"
                mode="contained"
                onPress={() => {
                  deleteReport(data._id);
                }}
              >
                Delete Report
              </Button>
            </>
          )}
        </View>

        {/* Modal */}
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={[containerStyle, { maxHeight: "80%" }]} // Set a maximum height
          >
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
              <View style={styles.reportSection}>
                <Text style={styles.reportText}>Update Report</Text>

                {/* Display Images Dynamically */}
                <View style={styles.imagesContainer}>
                  {images.length > 0 ? (
                    images.map((imageUri, index) => (
                      <Image
                        key={index}
                        source={{ uri: imageUri }}
                        style={styles.modalImage}
                        resizeMode="cover"
                      />
                    ))
                  ) : (
                    <Text style={styles.noImageText}>
                      No images yet. Add one!
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={pickImage}
                >
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.addImageButtonText}>Add Image</Text>
                </TouchableOpacity>

                <View style={styles.inputRowWithIcon}>
                  <TextInput
                    style={[styles.input, styles.inputWithIcon]}
                    placeholder="Plate Number"
                    placeholderTextColor="#aaa"
                    value={plate}
                    onChangeText={setPlate}
                  />
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={pickImageAndUpload}
                  >
                    <Ionicons name="camera" size={24} color="#000" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputRowWithIcon}>
                  <TextInput
                    style={[styles.input, styles.inputWithIcon]}
                    placeholder="Location"
                    placeholderTextColor="#aaa"
                    value={address}
                    onChangeText={setAddress}
                  />
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={getLocation}
                  >
                    <MaterialIcons name="my-location" size={20} color="#000" />
                  </TouchableOpacity>
                </View>

                {/* Description Input */}
                <TextInput
                  style={[styles.input, styles.reasonInput]}
                  placeholder="Reason"
                  placeholderTextColor="#aaa"
                  multiline
                  value={description}
                  onChangeText={setDescription}
                  numberOfLines={4}
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    handleSubmit(data._id);
                  }}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>
        </Portal>
      </ScrollView>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6e44ff" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default DetailReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  reportSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  reportText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  image: {
    width: "48%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imagePlaceholder: {
    width: "48%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
  },
  overlayContainer: {
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  moreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputRow: {
    marginVertical: 10,
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#f9f9f9",
    color: "#333",
  },
  reasonInput: {
    height: 120,
    textAlignVertical: "top",
  },
  inputRowWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10, // Adds space around the input and icon
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 10, // Adds space between the text and the icon
    color: "#333",
  },
  iconButton: {
    marginLeft: 8,
    marginRight: 8,
    alignSelf: "center",
  },
  submitButton: {
    backgroundColor: "#6e44ff",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "48%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  noImageText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
  addImageButton: {
    flexDirection: "row",
    backgroundColor: "#6e44ff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  addImageButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
});
