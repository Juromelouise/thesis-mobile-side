import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Title, Text, Button, Divider, List } from "react-native-paper";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={120}
          source={{ uri: "https://example.com/your-profile-pic.jpg" }}
        />
        <Title style={styles.title}>John Doe</Title>
        <Text style={styles.caption}>@johndoe</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.infoSection}>
        <List.Section>
          <List.Item
            title="Email"
            description="john.doe@example.com"
            left={() => <List.Icon icon="email" />}
          />
          <List.Item
            title="Phone"
            description="+1 (123) 456-7890"
            left={() => <List.Icon icon="phone" />}
          />
          <List.Item
            title="Location"
            description="San Francisco, CA"
            left={() => <List.Icon icon="map-marker" />}
          />
        </List.Section>
      </View>

      <Divider style={styles.divider} />

      <Button
        mode="contained"
        onPress={() => console.log("Edit Profile Pressed")}
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
