import Home from "@/screens/HomeScreens/Home";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import Webview from "@/screens/Webview";
import { RootStackParamList } from "@/types/statcks";

const Stack = createStackNavigator<RootStackParamList>();
export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
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
        component={Webview}
      />
    </Stack.Navigator>
  );
}
