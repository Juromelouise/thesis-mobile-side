import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Title, Text, Button, Divider, List } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons"; // Corrected import
import axios from "axios";
import { BASE_URL } from "../../assets/common/config";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const ProfileScreen = () => {
  const [user, setUser] = useState({});
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      axios
        .get(`${BASE_URL}/user/profile`)
        .then((response) => {
          setUser(response.data.user);
          console.log(response.data.user);
        })
        .catch((error) => {
          console.error("Error fetching profile data: ", error);
        });
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {user.avatar ? (
          <Avatar.Image size={120} source={{ uri: user.avatar.url }} />
        ) : (
          <FontAwesome name="user-circle" size={120} />
        )}
        <Title style={styles.title}>
          {user.firstName} {user.lastName}
        </Title>
        <Text style={styles.caption}>
          <Text style={{ fontWeight: "bold" }}>Since: </Text>
          {user.createdAt ? user.createdAt.split("T")[0] : "N/A"}
        </Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.infoSection}>
        <List.Section>
          <List.Item
            title="Email"
            description={user.email || "N/A"}
            left={() => <List.Icon icon="email" />}
          />
          <List.Item
            title="Phone"
            description={user.phoneNumber || "N/A"}
            left={() => <List.Icon icon="phone" />}
          />
          <List.Item
            title="Location"
            description={user.address || "N/A"}
            left={() => <List.Icon icon="map-marker" />}
          />
        </List.Section>
      </View>

      <Divider style={styles.divider} />

      <Button
        mode="contained"
        onPress={() => navigation.navigate("EditProfileScreen", { user })}
        style={styles.button}
      >
        Edit Profile
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    marginVertical: 10,
  },
  infoSection: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default ProfileScreen;
