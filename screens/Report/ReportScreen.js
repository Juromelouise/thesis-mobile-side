import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Camera icon
import * as ImagePicker from "expo-image-picker"; // To access the camera and photo library

export default function ReportScreen() {
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Update state and log the new state after update
      setImages((prevImages) => {
        const updatedImages = [...prevImages, result.assets[0].uri].slice(0, 4);
        console.log("Updated images:", updatedImages); // Log the updated array
        return updatedImages;
      });
    }
  };

  // useEffect(() => {
  //   // setImages([])
  //   console.log(images);
  // }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        {/* <Text style={styles.headerText}>VioApp</Text> */}

        {/* Report Section */}
        <View style={styles.reportSection}>
          <Text style={styles.reportText}>Report</Text>

          {/* Images Container */}
          <View style={styles.imagesContainer}>
            {/* First Image or Camera Icon */}
            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={pickImage}
            >
              {images[0] ? (
                <Image source={{ uri: images[0] }} style={styles.image} />
              ) : (
                <Ionicons name="camera" size={40} color="#888" />
              )}
            </TouchableOpacity>

            {/* Second Image or Camera Icon with Opacity if more images */}
            <TouchableOpacity
              style={[
                styles.imagePlaceholder,
                images.length > 2 && styles.overlayContainer,
              ]}
              onPress={pickImage}
            >
              {images[1] ? (
                <>
                  <Image source={{ uri: images[1] }} style={styles.image} />
                  {images.length > 2 && (
                    <View style={styles.overlay}>
                      <Text style={styles.moreText}>
                        +{images.length - 2} more
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <Ionicons name="camera" size={40} color="#888" />
              )}
            </TouchableOpacity>
          </View>

          {/* Plate Number Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Plate Number"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.clearButton}>
              <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
          </View>

          {/* Location Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.locationButton}>
              <Text style={styles.locationIcon}>📍</Text>
            </TouchableOpacity>
          </View>

          {/* Reason Text Area */}
          <TextInput
            style={[styles.input, styles.reasonInput]}
            placeholder="Reason"
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4} // Shrink Reason input area a bit
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
  reportSection: {
    backgroundColor: "#d3d3d3",
    borderRadius: 10,
    padding: 20,
    flex: 1,
  },
  reportText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  imagePlaceholder: {
    width: "45%",
    height: 150, // Increase size for larger image placeholders
    backgroundColor: "#ba9b9b",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
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
    fontSize: 18,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  clearButton: {
    marginLeft: 10,
  },
  clearButtonText: {
    fontSize: 18,
    color: "#000",
  },
  locationButton: {
    marginLeft: 10,
  },
  locationIcon: {
    fontSize: 18,
  },
  reasonInput: {
    height: 100, // Shrink Reason input
    textAlignVertical: "top",
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#6e44ff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
