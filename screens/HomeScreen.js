import React, { useState, useCallback, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "../assets/common/config";
import LottieView from "lottie-react-native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState("user");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10; // Number of items per page

  const getData = async (currentPage = 1, isRefreshing = false) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/report/fetch/all/reports`, {
        params: {
          page: currentPage,
          limit: limit
        }
      });
      
      const newData = response.data.data || [];
      
      if (isRefreshing) {
        setData(newData);
      } else {
        // Filter out duplicates before adding new data
        const filteredNewData = newData.filter(
          newItem => !data.some(existingItem => existingItem._id === newItem._id)
        );
        setData(prevData => [...prevData, ...filteredNewData]);
      }
      
      setHasMore(newData.length === limit);
      setPage(currentPage + 1);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/user/profile`);
        setRole(data.user.role);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData(1, true); // Reset to first page when screen is focused
      return () => {};
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData(1, true).then(() => setRefreshing(false));
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      getData(page);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  const ReportCard = ({
    createdAt,
    location,
    images,
    description,
    navigation,
    id,
    firstName,
    role,
    lastName,
    url,
  }) => {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            {role === "user" ? (
              <MaterialCommunityIcons
                name="account-circle"
                size={40}
                color="#1877f2"
                style={styles.avatar}
              />
            ) : (
              <Image
                source={{ uri: url }}
                style={styles.avatar}
              />
            )}

            <View style={styles.userTextContainer}>
              <View style={styles.nameContainer}>
                {role === "user" ? (
                  <Text style={styles.username}>Anonymous</Text>
                ) : (
                  <Text style={styles.username}>
                    {firstName && lastName
                      ? `${firstName} ${lastName}`
                      : "Anonymous"}
                  </Text>
                )}
              </View>
              <View style={styles.metaContainer}>
                <Text style={styles.date}>{createdAt?.split("T")[0]}</Text>
                <Ionicons
                  name="earth"
                  size={12}
                  color="#65676b"
                  style={styles.globeIcon}
                />
                {location && (
                  <>
                    <Ionicons
                      name="ellipse"
                      size={4}
                      color="#65676b"
                      style={styles.dotIcon}
                    />
                    <Ionicons
                      name="location-sharp"
                      size={12}
                      color="#65676b"
                    />
                    <Text style={styles.locationText}>{location}</Text>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ViewReportScreen", { id })}
          activeOpacity={0.9}
        >
          {/* Description */}
          {description && (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
          )}

          {/* Image Section */}
          {images && images.length > 0 && (
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
        </TouchableOpacity>
      </View>
    );
  };

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
          No Reports Available
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
          firstName={item.reporter?.firstName}
          lastName={item.reporter?.lastName}
          role={role}
          url={item.reporter?.avatar?.url}
        />
      )}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nameContainer: {
    marginBottom: 2,
  },
  username: {
    fontWeight: "600",
    fontSize: 15,
    color: "#050505",
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#65676b",
    marginRight: 4,
  },
  globeIcon: {
    marginRight: 4,
  },
  dotIcon: {
    marginHorizontal: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#65676b",
    marginLeft: 2,
  },
  descriptionBox: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 4,
  },
  descriptionText: {
    fontSize: 15,
    color: "#050505",
    lineHeight: 20,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  plusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});