import Lottie from "@/components/Lottie";
import { Image, View } from "react-native";

export default function SplashScreen() {
  return (
    <View
      style={{
        backgroundColor: "#1F1F1F",
        flex: 1,
      }}
    >
      <Image
        source={require("../../assets/splash.png")}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}
