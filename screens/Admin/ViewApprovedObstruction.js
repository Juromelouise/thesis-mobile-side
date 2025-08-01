import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useMemo } from "react";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import Gallery from "react-native-awesome-gallery";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";

const ViewApprovedObstruction = ({ route }) => {
  const { report } = route.params;
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [confirmationImages, setConfirmationImages] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Prepare gallery images from report.images
  const galleryImages = useMemo(
    () => (report.images || []).map((img) => ({ uri: img.url })),
    [report.images]
  );

  // Prepare confirmation images if any
  const [isConfirmationGalleryVisible, setIsConfirmationGalleryVisible] =
    useState(false);
  const [selectedConfirmationImageIndex, setSelectedConfirmationImageIndex] =
    useState(0);

  const selectImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 2,
    });

    if (!result.canceled) {
      setConfirmationImages(result.assets.slice(0, 2));
    }
  };

  // Take a picture using camera
  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setConfirmationImages([result.assets[0]]);
    }
  };

  // Show alert to choose image source
  const handleImageSelection = () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Select from Gallery", onPress: selectImages },
        { text: "Take a Picture", onPress: takePicture },
      ],
      { cancelable: true }
    );
  };

  // Update status to Resolved with confirmation images
  const updateStatusToResolved = async () => {
    if (confirmationImages.length < 1) {
      Alert.alert("Error", "Please select at least 1 image for confirmation.");
      return;
    }

    try {
      const formData = new FormData();
      confirmationImages.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          type: "image/jpeg",
          name: `confirmation_image_${index}.jpg`,
        });
      });
      formData.append("status", "Resolved");
      formData.append("reportId", report._id);

      console.log(formData);

      setLoading(true);

      const response = await axios.put(
        `${BASE_URL}/report/update-status/${report._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Report status updated to resolved.");
        setLoading(false);
        navigation.navigate("ApproveReports");
      } else {
        setLoading(false);
        Alert.alert("Error", "Failed to update report status.");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert(
        "Error",
        "An error occurred while updating the report status."
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.Text entering={FadeInDown} style={styles.headerText}>
        Approved Complaint Report
      </Animated.Text>
      <Animated.View entering={FadeInUp} style={styles.reportCard}>
        <Text style={styles.reportTitle}>Street:</Text>
        <Text style={styles.reportDescription}>{report.location}</Text>
        <Text style={styles.reportTitle}>Location:</Text>
        <Text style={styles.reportDescription}>{report.exactLocation}</Text>

        <Text style={styles.reportTitle}>Complaint:</Text>
        <Text style={styles.reportDescription}>{report.original}</Text>

        <Text style={styles.reportTitle}>Status:</Text>
        <Text style={styles.reportDescription}>{report.status}</Text>

        <Text style={styles.reportTitle}>Created At:</Text>
        <Text style={styles.reportDescription}>
          {new Date(report.createdAt).toLocaleString()}
        </Text>

        <Text style={styles.reportTitle}>Violations:</Text>
        <Text style={styles.reportDescription}>
          {(report.violations || []).join(", ")}
        </Text>

        <Text style={styles.sectionHeader}>Reporter Info:</Text>
        <View style={styles.reporterInfo}>
          <Image
            source={{ uri: report.reporter?.avatar?.url }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.reporterName}>
              {report.reporter?.firstName} {report.reporter?.lastName}
            </Text>
            <Text style={styles.reporterEmail}>{report.reporter?.email}</Text>
            <Text style={styles.reporterPhone}>
              {report.reporter?.phoneNumber}
            </Text>
            <Text style={styles.reporterAddress}>
              {report.reporter?.address}
            </Text>
          </View>
        </View>

        {galleryImages.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionHeader}>Report Images:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 10 }}
            >
              {galleryImages.slice(0, 2).map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setSelectedImageIndex(idx);
                    setIsGalleryVisible(true);
                  }}
                >
                  <View style={styles.imagePreview}>
                    <Image
                      source={{ uri: img.uri }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    {idx === 1 && galleryImages.length > 2 && (
                      <View style={styles.moreImagesOverlay}>
                        <Text style={styles.moreImagesText}>
                          +{galleryImages.length - 2}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Modal for full-screen gallery */}
            <Modal visible={isGalleryVisible} transparent={true}>
              <View style={styles.galleryContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsGalleryVisible(false)}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <Gallery
                  data={galleryImages.map((img) => img.uri)}
                  initialIndex={selectedImageIndex}
                  onSwipeToClose={() => setIsGalleryVisible(false)}
                  numToRender={5}
                  emptySpaceWidth={20}
                  doubleTapScale={2}
                  maxScale={4}
                  loop={true}
                />
              </View>
            </Modal>
          </View>
        )}

        {confirmationImages.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionHeader}>Confirmation Images:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 10 }}
            >
              {confirmationImages.slice(0, 2).map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setSelectedConfirmationImageIndex(idx);
                    setIsConfirmationGalleryVisible(true);
                  }}
                >
                  <View style={styles.imagePreview}>
                    <Image
                      source={{ uri: img.uri }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    {idx === 1 && confirmationImages.length > 2 && (
                      <View style={styles.moreImagesOverlay}>
                        <Text style={styles.moreImagesText}>
                          +{confirmationImages.length - 2}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Modal for confirmation images gallery */}
            <Modal visible={isConfirmationGalleryVisible} transparent={true}>
              <View style={styles.galleryContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsConfirmationGalleryVisible(false)}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <Gallery
                  data={confirmationImages.map((img) => img.uri)}
                  initialIndex={selectedConfirmationImageIndex}
                  onSwipeToClose={() => setIsConfirmationGalleryVisible(false)}
                  numToRender={5}
                  emptySpaceWidth={20}
                  doubleTapScale={2}
                  maxScale={4}
                  loop={true}
                />
              </View>
            </Modal>
          </View>
        )}

        <View style={styles.fixedButtonContainer}>
          <Button
            mode="contained"
            onPress={handleImageSelection}
            style={{
              marginBottom: 10,
              backgroundColor: "#6200ee",
              width: "100%",
            }}
            disabled={loading}
          >
            Select Confirmation Images
          </Button>

          {loading ? (
            <ActivityIndicator size="large" color="#6200ee" />
          ) : (
            <Button
              mode="contained"
              onPress={updateStatusToResolved}
              style={{ backgroundColor: "#6200ee", width: "100%" }}
              disabled={loading}
            >
              Update Status to Resolved
            </Button>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default ViewApprovedObstruction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  reportCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  reportDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  reporterInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: "#eee",
  },
  reporterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reporterEmail: {
    fontSize: 14,
    color: "#666",
  },
  reporterPhone: {
    fontSize: 14,
    color: "#666",
  },
  reporterAddress: {
    fontSize: 14,
    color: "#666",
  },
  imagePreview: {
    position: "relative",
    width: 150,
    height: 100,
    marginRight: 10,
    overflow: "hidden",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  moreImagesOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 150,
    height: 100,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  moreImagesText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
