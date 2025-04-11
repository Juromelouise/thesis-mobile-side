import * as Notifications from "expo-notifications";
import axios from "axios";

export const registerForPushNotificationsAsync = async (baseUrl, currentPushToken) => {

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  if (token !== currentPushToken) {
    try {
      await axios.put(`${baseUrl}/user/update-push-token`, {
        expoPushToken: token,
      });
      console.log("Push token updated successfully");
    } catch (error) {
      console.error("Error updating push token:", error);
    }
  } else {
    console.log("Push token is already up-to-date");
  }

  return token;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});