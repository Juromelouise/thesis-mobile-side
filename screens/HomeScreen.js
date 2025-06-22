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
import LottieView from "lottie-react-native";

const ReportCard = ({
  createdAt,
  location,
  images,
  description,
  navigation,
  id,
}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ViewReportScreen", { id })}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <MaterialCommunityIcons
              name="account-circle"
              size={40}
              color="#1877f2"
              style={styles.avatar}
            />
            <View>
              <Text style={styles.username}>Anonymous</Text>
              <Text style={styles.date}>{createdAt?.split("T")[0]}</Text>
              <Text style={styles.location}>{location}</Text>
            </View>
          </View>
        </View>

        {/* Image Section */}
        {images.length > 0 && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: images[0].url }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            {images.length > 1 && (
              <View style={styles.overlay}>
                <Text style={styles.plusText}>+{images.length - 1}</Text>
              </View>
            )}
          </View>
        )}

        {/* Description */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionBold}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
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

  if (!data || data.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { flex: 1, justifyContent: "center", alignItems: "center" },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LottieView
          source={require("../assets/nodata.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
        <Text style={{ marginTop: 20, fontSize: 18, color: "#888" }}>
          No Data Available
        </Text>
      </ScrollView>
    );
  }

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
          navigation={navigation}
          id={item._id}
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
    paddingVertical: 16, // Increased vertical padding
    backgroundColor: "#f0f2f5",
    minHeight: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 16, // Increased horizontal margin
    marginBottom: 20,     // Increased bottom margin
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 6,
    // Removed justifyContent: "space-between" for left alignment
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
    fontSize: 15,
    color: "#050505",
  },
  date: {
    fontSize: 12,
    color: "#65676b",
  },
  location: {
    fontSize: 12,
    color: "#65676b",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1.7, // Less tall image
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 8, // Added padding around the image
  },
  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  overlay: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  plusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  descriptionBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  description: {
    fontSize: 15,
    color: "#050505",
    lineHeight: 20,
  },
  descriptionBold: {
    fontSize: 15,
    color: "#050505",
    lineHeight: 20,
    fontWeight: "bold",
  },
});