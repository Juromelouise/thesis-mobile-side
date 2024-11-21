import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

const DetailReportScreen = ({ route }) => {
  const [data, setData] = useState({});

  useFocusEffect(
    useCallback(() => {
      setData(route.params.report || {});
    }, [route.params.report])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {data.images && data.images.length > 0 ? (
          data.images.map((img, index) => (
            <Image key={index} source={{ uri: img.url }} style={styles.image} />
          ))
        ) : (
          <Text style={styles.noImageText}>No images available</Text>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Reason for Reporting:</Text>
        <Text style={styles.text}>
          {data.description || "No description provided"}
        </Text>

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.text}>
          {data.createdAt?.split("T")[0] || "No date available"}
        </Text>

        <Text style={styles.label}>Location:</Text>
        <Text style={styles.text}>
          {data.location || "No location provided"}
        </Text>
      </View>
    </ScrollView>
  );
};

export default DetailReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  noImageText: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  text: {
    fontSize: 14,
    marginBottom: 12,
    color: "#555",
  },
});
