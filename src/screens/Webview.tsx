import React, { useEffect, useRef, useState } from "react";
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import { StackActions } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/statcks";
import * as SecureStore from "expo-secure-store";
import { URL } from "react-native-url-polyfill";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
} from "react-native";
import Loading from "@/components/Loading";
import { Toast } from "react-native-toast-notifications";
import { authState } from "@/recoil/authState";
import { useRecoilState } from "recoil";
import { StatusBar } from "expo-status-bar";
import Commnet from "@/components/Comment";
import { checkHybridRoutePath } from "@/lib/CheckHybridRoute";
import { isValidURL } from "@/lib/utils";
import AskedComment from "@/components/AskedComment";
import AskedReply from "@/components/AskedReply";

export type WebviewScreenProps = StackScreenProps<
  RootStackParamList,
  "Webview"
>;

export default function Webview({ navigation, route }: WebviewScreenProps) {
  const [loading, setLoading] = useState(true);
  const [showCommnetContainer, setShowCommnetContainer] = useState(false);
  const [auth, setAuth] = useRecoilState(authState);
  const webView = useRef<WebView>(null);
  const targetUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL;
  const url = route.params?.url
    ? isValidURL(route.params?.url)
      ? route.params?.url
      : targetUrl + route.params?.url
    : targetUrl + "/intro";
  const parsedUrl = new URL(url);

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
          const hybridRoute = checkHybridRoutePath(data.path);
          if (hybridRoute) {
            const pushAction = StackActions.push(hybridRoute.path, {
              ...hybridRoute.params,
            });
            navigation.dispatch(pushAction);
          } else {
            const pushAction = StackActions.push("Webview", {
              url: `${targetUrl}${data.path}`,
              isStack: true,
              scrollenabled: data.scroll,
            });
            navigation.dispatch(pushAction);
          }
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
    } else if (nativeEvent?.type === "OPEN_BROWSER_EVENT") {
      const data: {
        url: string;
      } = nativeEvent.data;
      Linking.canOpenURL(data.url).then((supported) => {
        if (supported) {
          Linking.openURL(data.url);
        } else {
          console.log("Don't know how to open URI: " + data.url);
        }
      });
    } else if (nativeEvent?.type === "LOGOUT_EVENT") {
      Alert.alert("로그아웃", "지금 로그아웃 하시겠습니까?", [
        {
          text: "취소",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "로그아웃",
          onPress: async () => {
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            setAuth({
              accessToken: "",
              refreshToken: "",
            });
            if (webView.current) {
              webView.current.postMessage(
                JSON.stringify({
                  type: "LOGOUT_EVENT",
                })
              );
            }
          },
        },
      ]);
    } else if (nativeEvent?.type === "ASKED_REPLAY_EVENT") {
      const data: {
        replyed: boolean;
      } = nativeEvent.data;
      setShowCommnetContainer(!data.replyed);
    }
  };

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    const whiteListUrl = new URL(process.env.EXPO_PUBLIC_WEBVIEW_URL as string);
    const navStateUrl = new URL(navState.url);
    if (loading) return;
    if (navStateUrl.host !== parsedUrl.host) {
      if (whiteListUrl.host !== navStateUrl.host) {
        webView.current?.stopLoading();
        Linking.openURL(navState.url);
        return false;
      }
    }
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff" translucent={false} />

      <SafeAreaView
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
            ref={webView}
            style={{ flex: 1 }}
            originWhitelist={["*"]}
            source={{
              uri: url,
            }}
            allowFileAccess
            showsVerticalScrollIndicator={false}
            decelerationRate="normal"
            onLoad={() => setLoading(false)}
            onMessage={requestOnMessage}
            userAgent={`SchoolMateApp ${Platform.OS}`}
            scrollEnabled={route.params?.scrollenabled ?? false}
            hideKeyboardAccessoryView={true}
            automaticallyAdjustContentInsets={false}
            renderLoading={() => <Loading />}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled
            thirdPartyCookiesEnabled
            mediaPlaybackRequiresUserAction={true}
            allowUniversalAccessFromFileURLs={true}
            allowFileAccessFromFileURLs={true}
            allowsInlineMediaPlayback={Platform.OS === "ios" ? true : false}
            onNavigationStateChange={onNavigationStateChange}
            allowsAirPlayForMediaPlayback
          />
          {/\/board\/\d+\/\d+$/.test(parsedUrl.pathname) && !loading && (
            <Commnet webview={webView} />
          )}
          {/^\/asked\/(?!intro$|modify$)[^\/]+\/?$/.test(parsedUrl.pathname) &&
            !loading && <AskedComment webview={webView} />}
          {/\/asked\/([a-fA-F0-9-]+)\/([a-fA-F0-9-]+)/.test(
            parsedUrl.pathname
          ) &&
            showCommnetContainer &&
            !loading && <AskedReply webview={webView} />}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
