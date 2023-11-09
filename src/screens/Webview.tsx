import React, { useEffect, useRef, useState } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { StackActions } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/statcks";
import { SafeAreaView, View } from "react-native";
import Loading from "@/components/Loading";

export type WebviewScreenProps = StackScreenProps<
  RootStackParamList,
  "Webview"
>;

export default function Webview({ navigation, route }: WebviewScreenProps) {
  const [visible, setVisible] = useState(true);
  const targetUrl = "http://192.168.0.3:3000";
  const url = route.params?.url ?? targetUrl + "/intro";

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
          const resetAction = StackActions.replace("Webview", {
            url: `${targetUrl}${data.path}`,
            isStack: true,
            scrollenabled: data.scroll,
          });
          navigation.dispatch(resetAction);
          return;
        }
        const pushAction = StackActions.push("Webview", {
          url: `${targetUrl}${data.path}`,
          isStack: true,
          scrollenabled: data.scroll,
        });
        navigation.dispatch(pushAction);
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
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <WebView
        originWhitelist={["*"]}
        source={{
          uri: url,
        }}
        onLoad={() => setVisible(false)}
        onMessage={requestOnMessage}
        scrollEnabled={route.params?.scrollenabled ?? false}
      />
      {visible && <Loading />}
    </View>
  );
}
