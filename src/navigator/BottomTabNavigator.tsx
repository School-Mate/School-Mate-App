import Webview from "@/screens/Webview";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/screens/HomeScreens/Home";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import My from "@/screens/HomeScreens/My";
import {
  HomeIcon,
  HomeLightIcon,
  BoardIcon,
  BoardLightIcon,
  SectionIcon,
  SectionLightIcon,
  MessageIcon,
  MessageLightIcon,
  UserIcon,
  UserLightIcon,
} from "@/icons";

const Tab = createBottomTabNavigator();
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <HomeIcon /> : <HomeLightIcon />,
        }}
      />
      <Tab.Screen
        name="Board"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <BoardIcon /> : <BoardLightIcon />,
        }}
      />
      <Tab.Screen
        name="List"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <SectionIcon /> : <SectionLightIcon />,
        }}
      />
      <Tab.Screen
        name="Message"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <MessageIcon /> : <MessageLightIcon />,
        }}
      />
      <Tab.Screen
        name="My"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <UserIcon /> : <UserLightIcon />,
        }}
      />
    </Tab.Navigator>
  );
}
