import { View, ActivityIndicator } from "react-native";

export default function Loading() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ActivityIndicator size="large" color="#2545ED" />
    </View>
  );
}
