import { RefObject, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Image,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import WebView from "react-native-webview";

const AskedComment = ({ webview }: { webview: RefObject<WebView> }) => {
  const [answer, setAnswer] = useState<string>();

  const postReply = () => {
    if (answer == "" || answer == undefined) return;

    if (webview.current) {
      webview.current.postMessage(
        JSON.stringify({
          type: "ASKED_REPLAY",
          data: {
            answer: answer,
          },
        })
      );
    }

    setAnswer("");
  };

  return (
    <>
      <KeyboardAvoidingView>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={answer}
              onChangeText={setAnswer}
              placeholder="답변을 입력해주세요"
            />
            <Pressable onPress={postReply} style={styles.button}>
              <Image
                source={require("../../assets/icons/upload.png")}
                style={{ width: 12, height: 18 }}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    height: 65,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    display: "flex",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 2,
    paddingTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    paddingLeft: 15,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingRight: 15,
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2545ED",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 8,
  },
});

export default AskedComment;
