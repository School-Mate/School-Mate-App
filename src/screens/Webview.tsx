import React, { useEffect, useRef, useState } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { StackActions } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/statcks";
import * as SecureStore from "expo-secure-store";
import {
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import Loading from "@/components/Loading";
import { Toast } from "react-native-toast-notifications";
import { authState } from "@/recoil/authState";
import { useRecoilState } from "recoil";

export type WebviewScreenProps = StackScreenProps<
  RootStackParamList,
  "Webview"
>;

const { StatusBarManager } = NativeModules;

export default function Webview({ navigation, route }: WebviewScreenProps) {
  const [visible, setVisible] = useState(true);
  const [auth, setAuth] = useRecoilState(authState);
  const targetUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL;
  const url = route.params?.url ?? targetUrl + "/intro";

  const initialJavaScript = `
    async(() => {
      const csrfToken = await fetch("/api/auth/csrf")
        .then((res) => res.json())
        .then((res) => res.csrfToken);
      console.log(csrfToken);
      const accessData = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        body: JSON.stringify({
          provider: "credentials",
          redirect: false,
          csrfToken,
          callbackUrl: "${process.env.EXPO_PUBLIC_WEBVIEW_URL}/auth/login",
          code: "${auth.accessToken}",
          json: true,
        }),
      }).then((res) => res.json());
      console.log(accessData);
    })();
    true;
  `;

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
        token?: {
          accessToken: string;
          refreshToken: string;
        };
      } = nativeEvent.data;

      if (data.type === "callback") {
        if (data.loginType === "phone") {
          await SecureStore.setItemAsync(
            "accessToken",
            data.token?.accessToken ?? ""
          );
          await SecureStore.setItemAsync(
            "refreshToken",
            data.token?.refreshToken ?? ""
          );
          setAuth({
            accessToken: data.token?.accessToken ?? "",
            refreshToken: data.token?.refreshToken ?? "",
          });
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "Webview",
                params: {
                  url: `${targetUrl}/main`,
                  isStack: false,
                },
              },
            ],
          });
        }
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
          nativeConfig={{
            props: {
              webContentsDebuggingEnabled: true,
              console: new MyLogger(),
            },
          }}
          onLoad={() => setVisible(false)}
          onMessage={requestOnMessage}
          userAgent={`SchoolMateApp ${Platform.OS}`}
          scrollEnabled={route.params?.scrollenabled ?? false}
          hideKeyboardAccessoryView={true}
          automaticallyAdjustContentInsets={false}
          injectedJavaScript={initialJavaScript}
        />
        {visible && <Loading />}
      </KeyboardAvoidingView>
    </View>
  );
}

class MyLogger {
  log = (message: any) => {
    console.log(message); // Print in RN logs for now...
  };
}
