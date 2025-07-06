import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";
import { setImageUpload } from "../../utils/formData";

const EditObstructionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { report } = route.params;

  const [description, setDescription] = useState(report.original || "");
  const [address, setAddress] = useState(report.location || "");
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState(report.images || []);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredStreets, setFilteredStreets] = useState([]);

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
    "Champaca Street (short)",
    "Champaca Street (long)",
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

  useEffect(() => {
    setFilteredStreets(streetOptions);
  }, []);

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

  const pickImage = async () => {
    if (newImages.length >= 3) {
      Alert.alert("Limit reached", "You can only add up to 3 images.");
      return;
    }

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Camera permission is needed to take photos."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  const removeNewImage = (index) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setImagesToDelete((prev) => [...prev, imageToRemove._id]);
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (
      !description.trim() ||
      !address.trim() ||
      newImages.length + existingImages.length < 3
    ) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("location", address);

      if (imagesToDelete.length > 0) {
        formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }

      if (newImages.length > 0) {
        const uploadedImages = await setImageUpload(newImages);
        uploadedImages.forEach((image) => {
          formData.append("images", image);
        });
      }

      const { data } = await axios.put(
        `${BASE_URL}/report/update/obstruction/${report._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data) {
        Alert.alert("Success", "Report updated successfully");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating report:", error);
      Alert.alert("Error", "An error occurred while updating the report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.reportIdContainer}>
        <Text style={styles.reportIdText}>Report ID: {report._id}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Images (3 required)</Text>
        <View style={styles.imagesContainer}>
          {existingImages.map((img, index) => (
            <View key={`existing-${index}`} style={styles.imageWrapper}>
              <Image source={{ uri: img.url }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeExistingImage(index)}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          {newImages.map((uri, index) => (
            <View key={`new-${index}`} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeNewImage(index)}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          {newImages.length + existingImages.length < 3 && (
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Ionicons name="camera" size={24} color="#6e44ff" />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setSearchModalVisible(true)}
        >
          <Text style={address ? styles.inputText : styles.placeholderText}>
            {address || "Select location"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Describe the obstruction"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />
      </View>

      <Button
        mode="contained"
        style={styles.submitButton}
        labelStyle={styles.submitButtonText}
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      >
        Update Report
      </Button>

      <Modal
        visible={searchModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search streets..."
              value={searchText}
              onChangeText={handleSearch}
              autoFocus
            />
            <FlatList
              data={filteredStreets}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.streetItem}
                  onPress={() => handleSelectStreet(item)}
                >
                  <Text style={styles.streetText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.streetsList}
            />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setSearchModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#6e44ff",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  reportIdContainer: {
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportIdText: {
    color: "#6e44ff",
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: "48%",
    height: 120,
    marginBottom: 15,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageButton: {
    width: "48%",
    height: 120,
    borderWidth: 1,
    borderColor: "#6e44ff",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    color: "#6e44ff",
    marginTop: 5,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  inputText: {
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    marginHorizontal: 20,
    marginTop: 25,
    paddingVertical: 10,
    backgroundColor: "#6e44ff",
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    maxHeight: "70%",
    padding: 20,
  },
  searchInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  streetsList: {
    maxHeight: "70%",
  },
  streetItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  streetText: {
    fontSize: 16,
  },
  closeModalButton: {
    marginTop: 15,
    alignSelf: "flex-end",
  },
  closeModalText: {
    color: "#6e44ff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditObstructionScreen;
