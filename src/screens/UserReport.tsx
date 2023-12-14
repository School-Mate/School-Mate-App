import { RootStackParamList } from "@/types/statcks";
import { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useLayoutEffect, useState } from "react";
import { HeaderLeftCancel } from "@components/layouts/HeaderLeft";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Toast } from "react-native-toast-notifications";
import useFetch from "@/hooks/useFetch";
import { useRecoilState } from "recoil";
import { authState } from "@/recoil/authState";

export type ArticleReportScreenProps = StackScreenProps<
  RootStackParamList,
  "UserReport"
>;

const UserReport = ({ navigation, route }: ArticleReportScreenProps) => {
  const [auth, setAuth] = useRecoilState(authState);
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState("");
  const { triggerFetch: reportArticle } = useFetch({
    fetchOptions: {
      url: `/report`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    },
    onSuccess: (status, message, data) => {
      setUploading(false);
      Alert.alert(
        "신고가 접수되었습니다.\n처리까지 최대 24시간이 소요될 수 있습니다."
      );

      navigation.reset({
        routes: [
          {
            name: "Webview",
            params: {
              url: `/board`,
            },
          },
          {
            name: "Webview",
            params: {
              url: `/user/${route.params.userId}/report/${data.id}`,
            },
          },
        ],
      });
    },
    onError: (status, message, body) => {
      setUploading(false);
      Toast.show(message, {
        type: "danger",
      });
    },
    onPending: () => {
      setUploading(true);
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={uploading || !content}
          onPress={() => {
            if (content === "") {
              Toast.show("내용을 입력해주세요.", {
                type: "danger",
              });
              return;
            }

            Alert.alert("해당 유저를 신고하시겠습니까?", undefined, [
              {
                text: "취소",
                onPress: () => {
                  return;
                },
              },
              {
                text: "확인",
                onPress: () => {
                  reportArticle({
                    fetchOptions: {
                      data: {
                        targetId: route.params.userId,
                        targetType: "user",
                        message: content,
                      },
                    },
                  });
                },
              },
            ]);
          }}
        >
          <Text
            style={{
              marginRight: 15,
              fontSize: 16,
              color: content ? "#007AFF" : "#999",
            }}
          >
            완료
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [content]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "유저 신고하기",
      headerTitleAlign: "center",
      headerLeft: () => <HeaderLeftCancel navigation={navigation} />,
    });
  }, []);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ padding: 15 }}>
            <View style={styles.container}>
              <TextInput
                style={styles.contentInput}
                onChangeText={setContent}
                placeholder="예) 부적절한 사진이 올라와있습니다."
                multiline={true}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 15,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginRight: 25,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/alert.png")}
                    style={{ width: 17, height: 17, marginRight: 5 }}
                  />
                  <Text style={{ color: "#B6B6B6" }}>
                    선택한 유저가 올바른 신고 대상인지 확인해주세요.
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 10,
                    marginRight: 25,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/alert.png")}
                    style={{ width: 17, height: 17, marginRight: 5 }}
                  />
                  <Text style={{ color: "#B6B6B6" }}>
                    신고자 정보 및 신고 내용은 신고 대상에게 공개되지 않으나,
                    사실 관계 확인에 꼭 필요한 신고 내용의 일부는 언급될 수
                    있습니다.
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 10,
                    marginRight: 25,
                  }}
                >
                  <Image
                    source={require("../../assets/icons/alert.png")}
                    style={{ width: 17, height: 17, marginRight: 5 }}
                  />
                  <Text style={{ color: "#B6B6B6" }}>
                    신고 대상은 스쿨메이트 이용 약관에 따라 활동 제한 등
                    불이익을 받을 수 있으며, 사실 관계 확인 시 쌍방 과실일 경우
                    신고자 또한 스쿨메이트 이용 약관에 따라 활동 제한 등의
                    불이익을 받을 수 있습니다.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  reportTitle: {
    color: "#B6B6B6",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomContainer: {
    backgroundColor: "white",
    height: 55,
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
    minHeight: 250,
    fontSize: 15,
    borderWidth: 1,
    textAlignVertical: "top",
    borderColor: "#F0F0F0",
    borderRadius: 10,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
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
  uploadImageList: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    marginTop: 10,
  },
  uploadImageItem: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  uploadImage: {
    width: "100%",
    height: "100%",
  },
  uploadImageDeleteButton: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadImageDeleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default UserReport;
