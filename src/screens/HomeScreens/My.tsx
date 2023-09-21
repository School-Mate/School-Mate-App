import Loading from "@components/Loading";
import { useState } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";

export default function My() {
  const [visible, setVisible] = useState(true);
  const url = "";
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <WebView
        originWhitelist={["*"]}
        source={{
          uri: url,
        }}
        onLoad={() => setVisible(false)}
      />
      {visible && <Loading />}
    </View>
  );
}
