import { View, StyleSheet } from "react-native";
import useDimensions from "@hooks/useDimensions";
import ViewLayout from "./layouts/ViewLayout";
import Lottie from "./Lottie";

export default function Loading() {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
      }}
    >
      <Lottie
        autoPlay
        source={require("../../assets/lottieFiles/loading.json")}
        loop
        style={{
          width: 80,
          height: 80,
        }}
      />
    </View>
  );
}
