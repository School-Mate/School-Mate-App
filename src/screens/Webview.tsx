import React from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { StackActions } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/statcks";

export type WebviewScreenProps = StackScreenProps<
  RootStackParamList,
  "Webview"
>;
export default function Webview({ navigation, route }: WebviewScreenProps) {
  const targetUrl = "";
  const url = route.params?.url ?? targetUrl;

  const requestOnMessage = async (e: WebViewMessageEvent): Promise<void> => {
    const nativeEvent = JSON.parse(e.nativeEvent.data);
    if (nativeEvent?.type === "ROUTER_EVENT") {
      const path: string = nativeEvent.data;
      if (path === "back") {
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
      } else {
        const pushAction = StackActions.push("Webview", {
          url: `${targetUrl}${path}`,
          isStack: true,
        });
        navigation.dispatch(pushAction);
      }
    }
  };

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ uri: url }}
      onMessage={requestOnMessage}
    />
  );
}
