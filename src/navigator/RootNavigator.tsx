import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Webview from "@/screens/Webview";
import { RootStackParamList } from "@/types/statcks";
import { authState } from "@/recoil/authState";
import { useRecoilState } from "recoil";

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
            ? process.env.EXPO_PUBLIC_WEBVIEW_URL
            : undefined,
        }}
        component={Webview}
      />
    </Stack.Navigator>
  );
}
