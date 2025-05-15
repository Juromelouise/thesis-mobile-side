import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useMemo } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Button, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Gallery from "react-native-awesome-gallery";

const ViewApprovedReport = ({ route }) => {
  const { report } = route.params;
  const [confirmationImages, setConfirmationImages] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isConfirmationGalleryVisible, setIsConfirmationGalleryVisible] =
    useState(false);
  const [selectedConfirmationImageIndex, setSelectedConfirmationImageIndex] =
    useState(0);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const galleryImages = useMemo(() => {
    return report.reportDetails
      .flatMap((detail) => detail.images || [])
      .map((img) => ({
        uri: img.url,
      }));
  }, [report.reportDetails]);

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

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setConfirmationImages([result.assets[0]]);
    }
  };

  const handleImageSelection = () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Select from Gallery",
          onPress: selectImages,
        },
        {
          text: "Take a Picture",
          onPress: takePicture,
        },
      ],
      { cancelable: true }
    );
  };

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
      formData.append("plateId", report._id);

      if (report.reportDetails && report.reportDetails.length > 0) {
        report.reportDetails.forEach((detail) => {
          formData.append("reportId", detail._id);
        });
      }

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

  console.log("Gallery Images:", galleryImages.length);

  return (
    <ScrollView style={styles.container}>
      <Animated.Text entering={FadeInDown} style={styles.headerText}>
        Approved Report
      </Animated.Text>
      <Animated.View entering={FadeInUp} style={styles.reportCard}>
        <Text style={styles.reportTitle}>
          Plate Number: {report.plateNumber}
        </Text>
        <Text style={styles.reportDescription}>Count: {report.count}</Text>
        <Text style={styles.reportDescription}>
          Created At: {new Date(report.createdAt).toLocaleString()}
        </Text>

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
                  <View
                    style={{
                      position: "relative",
                      width: 150,
                      height: 100,
                      marginRight: 10,
                      overflow: "hidden",
                      borderRadius: 10,
                    }}
                  >
                    <Image
                      source={{ uri: img.uri }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                      }}
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

        <Text style={styles.sectionHeader}>Violations:</Text>
        {report.violations.map((violation, index) => (
          <View key={index} style={styles.violationItem}>
            <Text style={styles.violationText}>
              Types: {violation.types.join(", ")}
            </Text>
          </View>
        ))}

        <Text style={styles.sectionHeader}>Report Details:</Text>
        {report.reportDetails.map((detail, index) => (
          <View key={index} style={styles.reportDetailItem}>
            <Text style={styles.reportDetailText}>
              Description: {detail.original}
            </Text>
            <Text style={styles.reportDetailText}>
              Location: {detail.location}
            </Text>
            <Text style={styles.reportDetailText}>Status: {detail.status}</Text>
            <Text style={styles.reportDetailText}>
              Created At: {new Date(detail.createdAt).toLocaleString()}
            </Text>
          </View>
        ))}

        <Button
          mode="contained"
          onPress={handleImageSelection}
          style={styles.button}
        >
          Select Confirmation Images
        </Button>
        {confirmationImages.length > 0 && (
          <View style={styles.imagesContainer}>
            {confirmationImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedConfirmationImageIndex(index);
                  setIsConfirmationGalleryVisible(true);
                }}
              >
                <Image source={{ uri: image.uri }} style={styles.image} />
              </TouchableOpacity>
            ))}
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
        <Button
          mode="contained"
          onPress={updateStatusToResolved}
          style={styles.button}
        >
          Update Status to Resolved
        </Button>
      </Animated.View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6e44ff" />
        </View>
      )}
    </ScrollView>
  );
};

export default ViewApprovedReport;

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
    marginBottom: 15,
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
    marginBottom: 10,
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
  violationItem: {
    marginBottom: 10,
  },
  violationText: {
    fontSize: 16,
    color: "#666",
  },
  reportDetailItem: {
    marginBottom: 15,
  },
  reportDetailText: {
    fontSize: 16,
    color: "#666",
  },
  imagesContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#6200ee",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    maxWidth: "90%",
    maxHeight: "80%",
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  exitButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  exitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
});
