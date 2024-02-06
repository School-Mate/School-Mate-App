import SplashScreen from "@screens/SplashScreen";
import * as Splash from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
  StackActions,
} from "@react-navigation/native";
import RootNavigator from "@/navigator/RootNavigator";
import SchoolMateToastProvider from "@/lib/ToastProvider";
import useFetch from "@/hooks/useFetch";
import * as SecureStore from "expo-secure-store";
import { RecoilRoot, useRecoilState } from "recoil";
import { authState } from "@/recoil/authState";
import * as Notifications from "expo-notifications";
import { isAllowPath, registerForPushNotificationsAsync } from "@/lib/utils";
import { PushMessageData } from "@/types/auth";
import * as Linking from "expo-linking";
import * as Sentry from "@sentry/react-native";
import AppsFlyerHandler from "@/components/AppsFlyer/InitializeSDKHandler";
import appsFlyer from "react-native-appsflyer";
import analytics from "@react-native-firebase/analytics";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { Settings as FacebookSDKInitialize } from "react-native-fbsdk-next";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: false,
  tracesSampleRate: 1.0,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
Splash.preventAutoHideAsync();

const prefix = Linking.createURL("/");
const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      Webview: "webview/:path",
    },
  },
};

function SchoolMateApp() {
  const url = Linking.useURL();
  const navigationRef = useRef<NavigationContainerRef<any>>();
  const [appIsReady, setAppIsReady] = useState(false);
  const { triggerFetch: authFetcher } = useFetch({});
  const [auth, setAuth] = useRecoilState(authState);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    async function prepare() {
      analytics().logEvent("app_open", {
        app_open: true,
      });
      FacebookSDKInitialize.initializeSDK();
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!accessToken || !refreshToken) {
        return setAppIsReady(true);
      }

      let pushToken;
      try {
        pushToken = await registerForPushNotificationsAsync();
      } catch (e) {
        Sentry.captureException(e);
      }

      try {
        const { status } = await requestTrackingPermissionsAsync();

        if (status === "granted") {
          await FacebookSDKInitialize.setAdvertiserTrackingEnabled(true);
        }
      } catch (e) {
        Sentry.captureException(e);
      }

      const {
        body: { data: authData },
        response: authResponse,
      } = await authFetcher({
        fetchOptions: {
          url: "/auth/apptoken",
          method: "POST",
          data: {
            token: accessToken,
            ...(pushToken && { pushToken: pushToken }),
          },
        },
      });

      if (authResponse && authResponse.status === 409) {
        const {
          body: { data: refreshAuthData },
          response: refreshAuthResponse,
        } = await authFetcher({
          fetchOptions: {
            url: "/auth/apprefreshtoken",
            method: "POST",
            data: {
              token: refreshToken,
            },
          },
        });

        if (refreshAuthResponse && refreshAuthResponse.status === 200) {
          setAuth({
            accessToken: refreshAuthData.accessToken,
            refreshToken: refreshAuthData.refreshToken,
            verfiyed: refreshAuthData.verfiyed,
          });
          await SecureStore.setItemAsync(
            "accessToken",
            refreshAuthData.accessToken
          );
          await SecureStore.setItemAsync(
            "refreshToken",
            refreshAuthData.refreshToken
          );
        }

        return setAppIsReady(true);
      }

      if (authResponse && authResponse.status === 200) {
        setAuth({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          verfiyed: authData.verfiyed,
        });
        await SecureStore.setItemAsync("accessToken", authData.accessToken);
        await SecureStore.setItemAsync("refreshToken", authData.refreshToken);
      }

      setAppIsReady(true);
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      const listener = Linking.addEventListener("url", event => {
        if (event) {
          if (!auth.accessToken || !auth.verfiyed) return;
          const { path, queryParams } = Linking.parse(event.url);
          if (path === "view" && queryParams?.url) {
            if (!isAllowPath(queryParams.url as string)) return;
            const pushAction = StackActions.push("Webview", queryParams as any);
            navigationRef.current?.dispatch(pushAction);
          }
        }
      });

      return () => {
        listener.remove();
      };
    }
  }, [appIsReady]);

  useEffect(() => {
    if (appIsReady) {
      const onDeepLinkCanceller = appsFlyer.onDeepLink(res => {
        if (!auth.accessToken || !auth.verfiyed) return;
        if (res?.deepLinkStatus === "FOUND") {
          if (
            res?.data.deep_link_value &&
            isAllowPath(res?.data.deep_link_value)
          ) {
            const pushAction = StackActions.push("Webview", {
              url: res?.data.deep_link_value,
              isStack: true,
              scrollenabled: true,
            });
            navigationRef.current?.dispatch(pushAction);
          }
        } else if (res?.deepLinkStatus === "NOT_FOUND") {
          console.log("Deep Link was not found");
        }
      });

      return () => {
        onDeepLinkCanceller();
      };
    }
  }, [appIsReady]);

  useEffect(() => {
    if (appIsReady) {
      (async () => {
        await Splash.hideAsync();

        if (url) {
          if (!auth.accessToken || !auth.verfiyed) return;
          const { path, queryParams } = Linking.parse(url);
          if (path === "view" && queryParams?.url) {
            if (!isAllowPath(queryParams.url as string)) return;
            const pushAction = StackActions.push("Webview", queryParams as any);
            navigationRef.current?.dispatch(pushAction);
          }
        }

        notificationListener.current =
          Notifications.addNotificationReceivedListener(notification => {
            const pushdata = notification.request.content
              .data as PushMessageData;
          });

        responseListener.current =
          Notifications.addNotificationResponseReceivedListener(response => {
            const pushdata = response.notification.request.content
              .data as PushMessageData;
            if (!auth.accessToken) return;
            if (pushdata.type === "openstack") {
              const pushAction = StackActions.push("Webview", {
                url: pushdata.url,
                isStack: true,
                scrollenabled: true,
              });
              navigationRef.current?.dispatch(pushAction);
            } else if (pushdata.type === "openstacks") {
              navigationRef.current?.reset({
                index: 0,
                routes: [
                  {
                    name: "Webview",
                    params: {
                      url: pushdata.url[0],
                      isStack: false,
                      scrollenabled: true,
                    },
                  },
                  {
                    name: "Webview",
                    params: {
                      url: pushdata.url[1],
                      isStack: false,
                      scrollenabled: true,
                    },
                  },
                ],
              });
            } else if (pushdata.type === "resetstack") {
              navigationRef.current?.reset({
                index: 0,
                routes: [
                  {
                    name: "Webview",
                    params: {
                      url: pushdata.url,
                      isStack: false,
                      scrollenabled: true,
                    },
                  },
                ],
              });
            }
          });
      })();

      return () => {
        if (
          typeof notificationListener.current !== "undefined" &&
          typeof responseListener.current !== "undefined"
        ) {
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
        }
      };
    }
  }, [appIsReady]);

  return (
    <SchoolMateToastProvider>
      {appIsReady ? (
        <NavigationContainer ref={navigationRef as any} linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      ) : (
        <SplashScreen />
      )}
    </SchoolMateToastProvider>
  );
}

function App() {
  return (
    <RecoilRoot>
      <AppsFlyerHandler />
      <SchoolMateApp />
    </RecoilRoot>
  );
}

export default Sentry.wrap(App);
