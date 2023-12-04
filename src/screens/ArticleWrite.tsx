import { RootStackParamList } from "@/types/statcks";
import { StackScreenProps } from "@react-navigation/stack";
import { useLayoutEffect, useState } from "react";
import { HeaderLeftCancel } from "@components/layouts/HeaderLeft";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, NavigationProp } from "@react-navigation/native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Toast } from "react-native-toast-notifications";

export type ArticleWriteScreenProps = StackScreenProps<
  RootStackParamList,
  "ArticleWrite"
>;

const ArticleWrite = ({ navigation, route }: ArticleWriteScreenProps) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [assets, setAssets] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "글 쓰기",
      headerTitleAlign: "center",
      headerLeft: () => <HeaderLeftCancel navigation={navigation} />,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            console.log("저장");
          }}
        >
          <Text style={{ marginRight: 15, fontSize: 16, color: "#007AFF" }}>
            완료
          </Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleCallbackImage = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 15 }}>
        <Alert navigation={navigation} />
        <View style={styles.container}>
          <TextInput
            style={styles.titleInput}
            onChangeText={(text) => console.log(text)}
            placeholder="제목을 입력하세요"
          />
          <TextInput
            style={styles.contentInput}
            onChangeText={(text) => console.log(text)}
            placeholder="자유롭게 이야기나 질문을 해보세요"
            multiline={true}
          />
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ArticleBottomItem
          isAnonymous={isAnonymous}
          callbackIsAnonymous={setIsAnonymous}
          callbackImages={handleCallbackImage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const ArticleBottomItem = ({
  isAnonymous,
  callbackIsAnonymous,
}: {
  isAnonymous: boolean;
  callbackIsAnonymous: (isAnonymous: boolean) => void;
  callbackImages: () => void;
}) => {
  const fetchImageFromUri = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show("이미지 접근 권한을 활성화 해주세요", {
        type: "error",
      });
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.canceled) return;

    for await (const asset of result.assets) {
      const image = await fetchImageFromUri(asset.uri);
      if (
        Platform.OS === "ios" &&
        (image.type.endsWith("image/heic") || image.type.endsWith("image/HEIC"))
      ) {
      }
    }
  };

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.checkboxContainer}>
        <BouncyCheckbox
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
          onPress={(isChecked: boolean) => callbackIsAnonymous(isChecked)}
        />
      </View>

      <Pressable
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={handleSelectImage}
      >
        <Text
          style={{
            marginRight: 8,
            fontSize: 15,
            fontWeight: "bold",
            color: "#7C7C7C"
          }}
        >
          사진 첨부
        </Text>
        <Image
          style={{
            width: 22,
            height: 22,
          }}
          source={require("../../assets/icons/image.png")}
        />
      </Pressable>
    </View>
  );
};

const Alert = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.alert}>
      <Pressable
        onPress={() => {
          navigation.push("Webview", {
            url: "/tos",
            scrollenabled: true,
          });
        }}
      >
        <Text
          style={{ fontSize: 15 }}
          numberOfLines={2}
          ellipsizeMode="tail"
          lineBreakMode="clip"
        >
          <Text style={{ fontWeight: "bold" }}>안내</Text> 게시글 작성 시
          이용규칙 위반 시 서비스 이용이 일정 기한 제한될 수 있습니다.{" "}
          <Text
            style={{
              textDecorationLine: "underline",
            }}
          >
            커뮤니티 이용규칙
          </Text>
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    display: "flex",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 2,
    paddingTop: 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  alert: {
    backgroundColor: "#F3F4F8",
    padding: 15,
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  titleInput: {
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    borderBottomColor: "#F0F0F0",
  },
  contentInput: {
    height: Dimensions.get("window").height - 270,
    marginTop: 10,
    fontSize: 15,
    borderBottomColor: "#F0F0F0",
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
  imageUploadContainer: {
    width: 15,
  },
});

export default ArticleWrite;
