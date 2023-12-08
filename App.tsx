import SplashScreen from "@screens/SplashScreen";
import * as Splash from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
  StackActions,
} from "@react-navigation/native";
import RootNavigator from "@/navigator/RootNavigator";
import SchoolMateToastProvider from "@/lib/ToastProvider";
import useFetch from "@/hooks/useFetch";
import * as SecureStore from "expo-secure-store";
import { RecoilRoot, selector, useRecoilState } from "recoil";
import { authState } from "@/recoil/authState";
import * as Notifications from "expo-notifications";
import { isAllowPath, registerForPushNotificationsAsync } from "@/lib/utils";
import { PushMessageData } from "@/types/auth";
import * as Linking from "expo-linking";

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
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const pushToken = await registerForPushNotificationsAsync();
      if (!accessToken || !refreshToken) {
        return setAppIsReady(true);
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
      (async () => {
        await Splash.hideAsync();

        if (url) {
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

export default function App() {
  return (
    <RecoilRoot>
      <SchoolMateApp />
    </RecoilRoot>
  );
}
