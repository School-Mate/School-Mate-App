import { View, StyleSheet } from "react-native";
import useDimensions from "@hooks/useDimensions";

interface ViewLayoutProps {
  children: React.ReactNode;
}

export default function ViewLayout(props: ViewLayoutProps) {
  const { screenWidth, screenHeight } = useDimensions();
  return (
    <View
      style={{
        width: screenWidth,
        height: screenHeight,
      }}
    >
      {props.children}
    </View>
  );
}
