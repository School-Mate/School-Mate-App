import { RootStackParamList } from "@/types/statcks";
import { StackScreenProps } from "@react-navigation/stack";
import { useLayoutEffect } from "react";
import { HeaderLeftCancel } from "@components/layouts/HeaderLeft";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Link, NavigationProp } from "@react-navigation/native";

export type ArticleWriteScreenProps = StackScreenProps<
  RootStackParamList,
  "ArticleWrite"
>;

const ArticleWrite = ({ navigation, route }: ArticleWriteScreenProps) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 15 }}>
        <Alert navigation={navigation} />
      </View>
    </SafeAreaView>
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
  },
  alert: {
    backgroundColor: "#F3F4F8",
    padding: 15,
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
});

export default ArticleWrite;
