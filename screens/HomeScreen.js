import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "../assets/common/config";

const ReportCard = ({ createdAt, location, images, description }) => {
  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Left Section: User Info */}
        <View style={styles.leftSection}>
          <View style={styles.userInfo}>
            <MaterialCommunityIcons
              name="account-circle"
              size={40}
              color="#555"
              style={styles.avatar}
            />
            <View>
              <Text style={styles.username}>Anonymous</Text>
              <Text style={styles.date}>{createdAt?.split("T")[0]}</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Right Section: Location */}
        <View style={styles.rightSection}>
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>

      {/* Image Boxes */}
      <View style={styles.imageContainer}>
        {images.slice(0, 2).map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.url }}
            style={styles.imageBox}
          />
        ))}
        {images.length > 2 && (
          <TouchableOpacity style={styles.overlay}>
            <Text style={styles.plusText}>+{images.length - 2}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Description Box */}
      <View style={styles.descriptionBox}>
        <ScrollView>
          <Text style={styles.description}>{description}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/report/fetch/all/reports`);
      setData(response.data.data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch reports. Please try again.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
      return () => {};
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData().then(() => setRefreshing(false));
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <ReportCard
          createdAt={item.createdAt}
          location={item.location}
          images={item.images}
          description={item.original}
        />
      )}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  leftSection: {
    flex: 1, // Equal space for left section
    flexDirection: "row",
    alignItems: "center",
  },
  rightSection: {
    flex: 1, // Equal space for right section
    justifyContent: "center",
    alignItems: "flex-end",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: "#555",
  },
  location: {
    fontSize: 12,
    color: "#777",
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#ccc",
    alignSelf: "center",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  imageBox: {
    width: "48%",
    height: 200,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: "0%",
    width: "48%",
    height: 200,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  plusText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  descriptionBox: {
    backgroundColor: "#d1b295",
    borderRadius: 5,
    padding: 15,
    height: 120,
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
});