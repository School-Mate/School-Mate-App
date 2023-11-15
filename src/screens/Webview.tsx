import React, { useEffect, useRef, useState } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { StackActions } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/statcks";
import {
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import Loading from "@/components/Loading";
import { Toast } from "react-native-toast-notifications";

export type WebviewScreenProps = StackScreenProps<
  RootStackParamList,
  "Webview"
>;

const { StatusBarManager } = NativeModules;

export default function Webview({ navigation, route }: WebviewScreenProps) {
  const [visible, setVisible] = useState(true);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const targetUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL;
  const url = route.params?.url ?? targetUrl + "/intro";

  useEffect(() => {
    Platform.OS == "ios"
      ? StatusBarManager.getHeight(
          (statusBarFrameData: { height: React.SetStateAction<number> }) => {
            setStatusBarHeight(statusBarFrameData.height);
          }
        )
      : null;
  }, []);

  const requestOnMessage = async (e: WebViewMessageEvent): Promise<void> => {
    const nativeEvent = JSON.parse(e.nativeEvent.data);
    console.log(nativeEvent);
    if (nativeEvent?.type === "ROUTER_EVENT") {
      const data: {
        path: string;
        type: "stack" | "reset";
        scroll?: boolean;
      } = nativeEvent.data;
      if (data.path === "back") {
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
      } else {
        if (data.type === "reset") {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "Webview",
                params: {
                  url: `${targetUrl}${data.path}`,
                  isStack: false,
                  scrollenabled: data.scroll,
                },
              },
            ],
          });
        } else {
          const pushAction = StackActions.push("Webview", {
            url: `${targetUrl}${data.path}`,
            isStack: true,
            scrollenabled: data.scroll,
          });
          navigation.dispatch(pushAction);
        }
      }
    } else if (nativeEvent?.type === "LOGIN_EVENT") {
      const data: {
        type: "callback" | "request";
        loginType: "kakao" | "apple" | "phone";
        token?: string;
      } = nativeEvent.data;

      if (data.type === "callback") {
      } else if (data.type === "request") {
        if (data.loginType === "apple") {
          try {
          } catch (e: any) {
            if (e.code == "ERR_REQUEST_CANCELED") {
              console.log("User canceled Apple Sign in.");
            }
          }
        }
      }
    } else if (nativeEvent?.type === "TOAST_EVENT") {
      const data: {
        type: "success" | "error";
        message: string;
      } = nativeEvent.data;
      Toast.show(data.message, {
        type: data.type === "success" ? "success" : "danger",
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <WebView
          originWhitelist={["*"]}
          source={{
            uri: url,
          }}
          onLoad={() => setVisible(false)}
          onMessage={requestOnMessage}
          userAgent={`SchoolMateApp ${Platform.OS}`}
          scrollEnabled={route.params?.scrollenabled ?? false}
          hideKeyboardAccessoryView={true}
          automaticallyAdjustContentInsets={false}
        />
        {visible && <Loading />}
      </KeyboardAvoidingView>
    </View>
  );
}
