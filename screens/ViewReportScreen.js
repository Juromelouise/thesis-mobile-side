import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../assets/common/config";
import Gallery from "react-native-awesome-gallery";
import { filterText } from "../utils/filterText";

const ViewReportScreen = ({ route }) => {
  const { id } = route.params;
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [role, setRole] = useState("user"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/report/admin/report/${id}`
        );
        const { data } = await axios.get(`${BASE_URL}/user/profile`);
       setRole(data.user.role);
        setData(response.data.report);
        setComments(response.data.report.comment || []);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/comment/${id}/comment`, {
        text: newComment,
      });
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setIsGalleryVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Report not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Report Details */}
      <View style={styles.card}>
        <Text style={styles.title}>{data.original}</Text>
        <Text style={styles.location}>
          <Text style={styles.label}>Location:</Text> {data.location}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {data.images?.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(index)}
            >
              <Image source={{ uri: image.url }} style={styles.fullImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Comments Section */}
      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Comments</Text>
        <ScrollView style={styles.commentsList}>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <View key={comment._id} style={styles.commentCard}>
                <Text style={styles.commentUser}>
                  {comment.user?.firstName + " " + comment.user?.lastName ||
                    "Anonymous"}
                </Text>
                <Text style={styles.commentContent}>
                  {/* Filter text for users, don't filter for admin/superadmin */}
                  {filterText(comment.content, role)}
                </Text>
                <Text style={styles.commentDate}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noCommentsText}>No comments yet.</Text>
          )}
        </ScrollView>

        {/* Add Comment Section */}
        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write your comment here..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddComment}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Full-Screen Image Gallery */}
      {isGalleryVisible && (
        <Modal visible={isGalleryVisible} transparent={true}>
          <View style={styles.galleryContainer}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsGalleryVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {/* Gallery Component */}
            <Gallery
              data={data?.images
                ?.filter((image) => typeof image?.url === "string")
                ?.map((image) => image.url)}
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
      )}
    </ScrollView>
  );
};

export default ViewReportScreen;

const styles = StyleSheet.create({
  galleryContainer: {
    flex: 1,
    backgroundColor: "black", // Background color for the gallery
  },
  closeButton: {
    position: "absolute",
    top: 40, // Adjust for safe area
    right: 20,
    zIndex: 10, // Ensure the button is above the gallery
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  location: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  imageScroll: {
    flexDirection: "row",
    marginTop: 10,
  },
  fullImage: {
    width: 300,
    height: 185,
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: 10,
  },
  commentsSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  commentsList: {
    maxHeight: 200,
    marginBottom: 15,
  },
  commentCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  commentContent: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  commentDate: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
  noCommentsText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  addCommentContainer: {
    marginTop: 10,
  },
  commentInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
  },
});
