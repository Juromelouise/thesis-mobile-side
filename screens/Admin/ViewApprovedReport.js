import { StyleSheet, Text, View, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Button, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";


const ViewApprovedReport = ({ route }) => {
  const { report } = route.params;
  const [confirmationImages, setConfirmationImages] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

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
        setLoading(false)
        Alert.alert("Error", "Failed to update report status.");
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
      Alert.alert(
        "Error",
        "An error occurred while updating the report status."
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.Text entering={FadeInDown} style={styles.headerText}>
        Approved Report
      </Animated.Text>
      <Animated.View entering={FadeInUp} style={styles.reportCard}>
        {report && report.plateNumber ? (
          <>
            <Text style={styles.reportTitle}>
              Plate Number:{" "}
              {report.plateNumber ? report.plateNumber.plateNumber : "N/A"}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.reportTitle}>Obstruction:</Text>
          </>
        )}
        <Text style={styles.reportDescription}>
          Description: {report.original}
        </Text>
        {report && report.plateNumber ? (
          <>
            <Text style={styles.reportDescription}>
              Violations: {report.plateNumber.violations.join(", ")}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.reportDescription}>
              Violations: {report.violations.join(", ")}
            </Text>
          </>
        )}
        <Text style={styles.reportLocation}>Location: {report.location}</Text>
        <Text style={styles.reportStatus}>Status: {report.status}</Text>
        <Text style={styles.reportDate}>
          Reported At: {new Date(report.createdAt).toLocaleString()}
        </Text>
        <View style={styles.reporterInfo}>
          <Text style={styles.reporterName}>
            Reporter: {report.reporter.firstName} {report.reporter.lastName}
          </Text>
          <Text style={styles.reporterEmail}>
            Email: {report.reporter.email}
          </Text>
          <Text style={styles.reporterCount}>
            Reports Count:{" "}
            {report.plateNumber ? report.plateNumber.count : "N/A"}
          </Text>
        </View>
        {report.images && report.images.length > 0 && (
          <View style={styles.imagesContainer}>
            {report.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.url }}
                style={styles.image}
              />
            ))}
          </View>
        )}
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
              <Image
                key={index}
                source={{ uri: image.uri }}
                style={styles.image}
              />
            ))}
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
  reportLocation: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  reportStatus: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  reportDate: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  reporterInfo: {
    marginTop: 20,
  },
  reporterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  reporterEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  reporterCount: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
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
});
