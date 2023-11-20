import SplashScreen from "@screens/SplashScreen";
import { StyleSheet, Text, View } from "react-native";
import * as Splash from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "@/navigator/RootNavigator";
import SchoolMateToastProvider from "@/lib/ToastProvider";
import useFetch from "@/hooks/useFetch";
import * as SecureStore from "expo-secure-store";
import { RecoilRoot, selector, useRecoilState } from "recoil";
import { authState } from "@/recoil/authState";

Splash.preventAutoHideAsync();

function SchoolMateApp() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { triggerFetch: authFetcher } = useFetch({});
  const [auth, setAuth] = useRecoilState(authState);
  useEffect(() => {
    async function prepare() {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
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
      Splash.hideAsync();
    }
  }, [appIsReady]);

  return (
    <SchoolMateToastProvider>
      {appIsReady ? (
        <NavigationContainer>
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
