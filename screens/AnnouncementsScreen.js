import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React from "react";
import axios from "axios";
import { BASE_URL } from "../assets/common/config";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { ScrollView, RefreshControl } from "react-native";
import LottieView from "lottie-react-native";

const AnnouncementsScreen = () => {
  const [announcements, setAnnouncements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false); // Add this
  const navigation = useNavigation();

   const fetchAnnouncements = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/announce/show`);
          setAnnouncements(response.data.announcement);
        } catch (error) {
          console.error("Error fetching announcements:", error);
        } finally {
          setLoading(false);
        }
      };

  useFocusEffect(
    React.useCallback(() => {
      fetchAnnouncements();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAnnouncements().then(() => setRefreshing(false));
  }, []);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const renderAnnouncement = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ViewAnnouncementScreen", { item })}
    >
      <View style={styles.announcementCard}>
        {item.picture && item.picture.length > 0 && (
          <Image
            source={{ uri: item.picture[0].url }}
            style={styles.announcementImage}
          />
        )}
        <View style={styles.announcementContent}>
          <Text style={styles.announcementTitle}>{item.title}</Text>
          <Text style={styles.announcementDescription}>
            {truncateText(item.description, 120)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading announcements...</Text>
      </View>
    );
  }

  if (!announcements || announcements.length === 0) {
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
    <View style={styles.container}>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item._id}
        renderItem={renderAnnouncement}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default AnnouncementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#888",
  },
  announcementCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  announcementImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  announcementContent: {
    flex: 1,
    padding: 15,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  announcementDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
