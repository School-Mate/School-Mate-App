import SplashScreen from "@screens/SplashScreen";
import { StyleSheet, Text, View } from "react-native";
import * as Splash from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "@/navigator/RootNavigator";
import SchoolMateToastProvider from "@/lib/ToastProvider";
import useFetch from "@/hooks/useFetch";

Splash.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { triggerFetch: authFetcher } = useFetch({});
  useEffect(() => {
    async function prepare() {
      try {
        await authFetcher({
          fetchOptions: {
            url: "/auth/me",
          },
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
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
