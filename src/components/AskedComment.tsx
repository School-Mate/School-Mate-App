import { RefObject, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import WebView from "react-native-webview";

const AskedComment = ({ webview }: { webview: RefObject<WebView> }) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [question, setQuestion] = useState<string>();

  const postAsked = () => {
    if (question == "" || question == undefined) return;

    if (webview.current) {
      webview.current.postMessage(
        JSON.stringify({
          type: "ASKED_QUESTION",
          data: {
            question,
            isAnonymous,
          },
        })
      );
    }

    setQuestion("");
  };

  return (
    <>
      <KeyboardAvoidingView>
        <View style={styles.container}>
          <View style={styles.checkboxContainer}>
            <BouncyCheckbox
              isChecked={isAnonymous}
              size={20}
              fillColor="#2545ED"
              unfillColor="#FFFFFF"
              innerIconStyle={{
                borderRadius: 5,
                borderColor: isAnonymous ? "#2545ED" : "#E5E5E5",
              }}
              iconStyle={{
                borderRadius: 5,
                borderColor: isAnonymous ? "#2545ED" : "#E5E5E5",
              }}
              textComponent={
                <Text
                  style={{
                    ...styles.checkboxText,
                    color: isAnonymous ? "#2545ED" : "gray",
                  }}
                >
                  익명
                </Text>
              }
              onPress={(isChecked: boolean) => setIsAnonymous(isChecked)}
            />
          </View>
          <TextInput
            style={styles.input}
            value={question}
            onChangeText={setQuestion}
            placeholder="질문을 입력해주세요"
          />

          <Pressable onPress={postAsked} style={styles.button}>
            <Text
              style={{
                color: "white",
              }}
            >
              등록
            </Text>
          </Pressable>
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
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    width: 60,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#2545ED",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
});

export default AskedComment;
