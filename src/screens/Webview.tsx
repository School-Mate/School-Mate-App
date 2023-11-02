import React, { useRef, useState } from "react";
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
  const targetUrl = "http://localhost:3001";
  const url = route.params?.url ?? targetUrl + "/auth";

  const requestOnMessage = async (e: WebViewMessageEvent): Promise<void> => {
    const nativeEvent = JSON.parse(e.nativeEvent.data);
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
          });
          navigation.dispatch(resetAction);
          return;
        }
        const pushAction = StackActions.push("Webview", {
          url: `${targetUrl}${data.path}`,
          isStack: true,
        });
        navigation.dispatch(pushAction);
      }
    }
  };

  return (
    <SafeAreaView
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
        scrollEnabled={false}
      />
      {visible && <Loading />}
    </SafeAreaView>
  );
}
