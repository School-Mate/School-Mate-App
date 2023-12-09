import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Webview from "@/screens/Webview";
import { RootStackParamList } from "@/types/statcks";
import { authState } from "@/recoil/authState";
import { useRecoilState } from "recoil";
import ArticleWrite from "@/screens/ArticleWrite";
import ArticleReport from "@/screens/ArticleReport";

const Stack = createStackNavigator<RootStackParamList>();
export default function RootNavigator() {
  const [auth, setAuth] = useRecoilState(authState);

  return (
    <Stack.Navigator
      initialRouteName="Webview"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
    >
      <Stack.Screen
        options={{
          transitionSpec: {
            open: {
              animation: "spring",
              config: {
                stiffness: 2000,
                damping: 1000,
              },
            },
            close: {
              animation: "spring",
              config: {
                stiffness: 1000,
                damping: 500,
              },
            },
          },
        }}
        name="Webview"
        initialParams={{
          url: auth.accessToken
            ? process.env.EXPO_PUBLIC_WEBVIEW_URL +
              "/auth/login/app?token=" +
              auth.accessToken
            : undefined,
          scrollenabled: true,
        }}
        component={Webview}
      />
      <Stack.Screen
        options={{
          ...TransitionPresets.BottomSheetAndroid,
        }}
        name="ArticleWrite"
        component={ArticleWrite}
      />
      <Stack.Screen
        options={{
          ...TransitionPresets.BottomSheetAndroid,
        }}
        name="ArticleReport"
        component={ArticleReport}
      />
    </Stack.Navigator>
  );
}
