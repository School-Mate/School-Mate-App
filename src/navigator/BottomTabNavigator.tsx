import Webview from "@/screens/Webview";
import { Image, View } from "react-native";
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
  DotIcon,
  DotEmptyIcon,
  DotGradientIcon,
} from "@/icons";

const Tab = createBottomTabNavigator();
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          height: 100,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <HomeIcon /> : <HomeLightIcon />,
          tabBarLabel: ({ focused }) =>
            focused ? <DotIcon /> : <DotEmptyIcon />,
        }}
      />
      <Tab.Screen
        name="Board"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <BoardIcon /> : <BoardLightIcon />,
          tabBarLabel: ({ focused }) =>
            focused ? <DotIcon /> : <DotEmptyIcon />,
        }}
      />
      <Tab.Screen
        name="List"
        component={Home}
        options={{
          tabBarIcon: () => <SectionIcon />,
          tabBarLabel: ({ focused }) =>
            focused ? <DotGradientIcon /> : <DotEmptyIcon />,
        }}
      />
      <Tab.Screen
        name="Message"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <MessageIcon /> : <MessageLightIcon />,
          tabBarLabel: ({ focused }) =>
            focused ? <DotIcon /> : <DotEmptyIcon />,
        }}
      />
      <Tab.Screen
        name="My"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? <UserIcon /> : <UserLightIcon />,
          tabBarLabel: ({ focused }) =>
            focused ? <DotIcon /> : <DotEmptyIcon />,
        }}
      />
    </Tab.Navigator>
  );
}
