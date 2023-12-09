import * as Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import { AllowPaths } from "./Contants";

export function isValidURL(url: string) {
  var RegExp =
    /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  if (RegExp.test(url)) {
    return true;
  } else {
    return false;
  }
}

export function isAllowPath(path: string) {
  return AllowPaths.some(p => p.test(path));
}

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FFFFFF",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("서비스 관련 알림을 받기 위해서 알림 권한을 허용해주세요.");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });
    console.log(token);
  } else {
    Alert.alert("실제 기기에서만 푸시 알림을 받을 수 있습니다.");
  }

  return token ? token.data : null;
}
