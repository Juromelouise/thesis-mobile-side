import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { BASE_URL } from "../../assets/common/config";
import axios from "axios";

import { useNavigation } from "@react-navigation/native";

const DetailObstructionScreen = ({ route }) => {
  const [data, setData] = useState({});
  const [confirmationImages, setConfirmationImages] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigation();

  const getData = async () => {
    setLoading(true);
    const id = route.params.report;
    try {
      const { data } = await axios.get(
        `${BASE_URL}/report/admin/obstruction/${id}`
      );
      setData(data);
      setConfirmationImages(data.data.confirmationImages || []);
      setData(data.data);
      console.log("Data fetched:", data.data);
      if (data.data.status === "Pending") {
        setStatus("Submitted");
      } else {
        setStatus(data.data.status);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
      navigate.navigate("Home");
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
                `${BASE_URL}/report/delete/obstruction/${id}`,
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

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [route.params.report])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading report details...</Text>
      </View>
    );
  }

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
          {data.status === "Resolved" && confirmationImages.length > 0 && (
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
            <Text style={styles.label}>Violation:</Text>
            <Text style={styles.input}>
              {data?.violations?.length > 0
                ? data?.violations.join(", ")
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
                onPress={() => {
                  navigate.navigate("EditObstructionScreen", { report: data });
                }}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailObstructionScreen;

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
