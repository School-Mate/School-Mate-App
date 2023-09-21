import Webview from "@/screens/Webview";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/screens/HomeScreens/Home";
import My from "@/screens/HomeScreens/My";

const BottomTab = createBottomTabNavigator();
export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="ScreenA">
      <BottomTab.Screen name="ScreenA" component={Home} />
      <BottomTab.Screen name="ScreenB" component={Home} />
      <BottomTab.Screen name="내 정보" component={My} />
    </BottomTab.Navigator>
  );
}
