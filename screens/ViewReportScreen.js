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
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../assets/common/config";
import Gallery from "react-native-awesome-gallery";
import { filterText } from "../utils/filterText";

const { height } = Dimensions.get('window');

const ViewReportScreen = ({ route }) => {
  const { id } = route.params;
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [role, setRole] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BASE_URL}/comment/${id}/comment`, {
        text: newComment,
      });
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
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
            {role === "user" ? (
              <>
                {data.images?.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleImagePress(index)}
                  >
                    <Image source={{ uri: image.url }} style={styles.fullImage} />
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <>
              {data.imagesAdmin?.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(index)}
              >
                <Image source={{ uri: image.url }} style={styles.fullImage} />
              </TouchableOpacity>
            ))}</>
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Comments Section - Absolute Position */}
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>Comments</Text>
        
        <ScrollView 
          style={styles.commentsScroll}
          contentContainerStyle={styles.commentsContent}
          keyboardShouldPersistTaps="handled"
        >
          {comments.length > 0 ? (
            comments.map((comment) => (
              <View key={comment._id} style={styles.commentCard}>
                {role === "user" ? (
                  <Text style={styles.commentUser}>Anonymous</Text>
                ) : (
                  <Text style={styles.commentUser}>
                    {comment.user?.firstName + " " + comment.user?.lastName ||
                      "Anonymous"}
                  </Text>
                )}

                <Text style={styles.commentContent}>
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
            editable={!isSubmitting}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!newComment.trim() || isSubmitting) && styles.disabledButton
            ]}
            onPress={handleAddComment}
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 250, // Space for the comments section
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
  // Comments Section Styles
  commentsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    maxHeight: height * 0.5, // Take up to half of screen height
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  commentsScroll: {
    flex: 1,
  },
  commentsContent: {
    paddingBottom: 10,
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
    paddingVertical: 20,
  },
  addCommentContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  commentInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
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

export default ViewReportScreen;