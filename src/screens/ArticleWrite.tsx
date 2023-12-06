import { RootStackParamList } from "@/types/statcks";
import { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useLayoutEffect, useState } from "react";
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
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Toast } from "react-native-toast-notifications";
import fetcher, { sendXmlHttpRequest } from "@/lib/Fetcher";
import useFetch from "@/hooks/useFetch";
import { useRecoilState } from "recoil";
import { authState } from "@/recoil/authState";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";

export type ArticleWriteScreenProps = StackScreenProps<
  RootStackParamList,
  "ArticleWrite"
>;

const ArticleWrite = ({ navigation, route }: ArticleWriteScreenProps) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<ImageType[]>([]);
  const [auth, setAuth] = useRecoilState(authState);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { triggerFetch: writeArticle } = useFetch({
    fetchOptions: {
      url: `/board/${route.params.boardId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    },
    onSuccess: (status, message, data) => {
      setUploading(false);
      Toast.show("글이 작성되었습니다.", {
        type: "success",
      });

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
              url: `/board/${route.params.boardId}`,
            },
          },
          {
            name: "Webview",
            params: {
              url: `/board/${route.params.boardId}/${data.id}`,
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
          disabled={uploading || !title || !content}
          onPress={() => {
            if (title === "") {
              Toast.show("제목을 입력해주세요.", {
                type: "danger",
              });
              return;
            }

            if (content === "") {
              Toast.show("내용을 입력해주세요.", {
                type: "danger",
              });
              return;
            }

            Alert.alert("글을 작성하시겠습니까?", undefined, [
              {
                text: "취소",
                onPress: () => {
                  return;
                },
              },
              {
                text: "확인",
                onPress: () => {
                  writeArticle({
                    fetchOptions: {
                      data: {
                        title: title,
                        content: content,
                        isAnonymous: isAnonymous,
                        images: uploadedImages.map(v => v.key),
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
              color: title && content ? "#007AFF" : "#999",
            }}
          >
            완료
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [title, content, isAnonymous, uploadedImages]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "글 쓰기",
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
            <AlertBadage navigation={navigation} />
            <View style={styles.container}>
              <TextInput
                style={styles.titleInput}
                onChangeText={setTitle}
                placeholder="제목을 입력하세요"
              />
              <TextInput
                style={styles.contentInput}
                onChangeText={setContent}
                placeholder="자유롭게 이야기나 질문을 해보세요"
                multiline={true}
              />
              {/* upload image List */}
              <ScrollView style={styles.uploadImageList} horizontal>
                {uploadedImages.map((image, index) => (
                  <ArticleUploadImage
                    key={index}
                    image={image}
                    callbackDeleteImage={key => {
                      setUploadedImages(prev =>
                        prev.filter(v => v.key !== key)
                      );
                    }}
                    accessToken={auth.accessToken}
                  />
                ))}
                {uploadingImage && (
                  <View style={styles.uploadImageItem}>
                    <ActivityIndicator size="large" color="#2545ED" />
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <ArticleBottomItem
            isAnonymous={isAnonymous}
            callbackIsAnonymous={setIsAnonymous}
            callbackImages={async (formData, url) => {
              setUploadingImage(true);
              await sendXmlHttpRequest("/image", formData, {
                Authorization: `Bearer ${auth.accessToken}`,
                storage: "article",
              })
                .then((res: any) => {
                  Toast.show("이미지가 업로드 되었습니다.", {
                    type: "success",
                  });
                  setUploadedImages(prev => [
                    ...prev,
                    {
                      uri: url,
                      key: res.data,
                    },
                  ]);
                })
                .catch(e => {
                  Toast.show(e.message, {
                    type: "danger",
                  });
                })
                .finally(() => {
                  setUploadingImage(false);
                });
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};
type ImageType = {
  uri: string;
  key: string;
};

type ArticleBottomItemProps = {
  image: ImageType;
  accessToken?: string;
  callbackDeleteImage: (key: string) => void;
};

const ArticleUploadImage = ({
  image,
  accessToken,
  callbackDeleteImage,
}: ArticleBottomItemProps) => {
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);
  const { triggerFetch: deleteImage } = useFetch({
    fetchOptions: {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    onPending: () => setDeleteImageLoading(true),
    onSuccess: (status, message, data) => {
      setDeleteImageLoading(false);
      callbackDeleteImage(data.id);
      Toast.show("이미지가 삭제되었습니다.", {
        type: "success",
      });
    },
    onError: (status, message) => {
      setDeleteImageLoading(false);
      Toast.show(message, {
        type: "danger",
      });
    },
  });

  return (
    <>
      <View style={styles.uploadImageItem}>
        <Image source={{ uri: image.uri }} style={styles.uploadImage} />
        {deleteImageLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        <TouchableOpacity
          style={styles.uploadImageDeleteButton}
          onPress={() => {
            deleteImage({
              fetchOptions: {
                url: `/image/${image.key}`,
              },
            });
          }}
        >
          <Image
            source={require("../../assets/icons/cancel.png")}
            style={{
              width: 10,
              height: 10,
            }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const ArticleBottomItem = ({
  isAnonymous,
  callbackIsAnonymous,
  callbackImages,
}: {
  isAnonymous: boolean;
  callbackIsAnonymous: (isAnonymous: boolean) => void;
  callbackImages: (formdata: FormData, url: string) => void;
}) => {
  const fetchImageFromUri = async (url: string) => {
    const imageData = await ImageManipulator.manipulateAsync(url, [], {
      compress: 0.6,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    });

    return imageData;
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
      quality: 1,
      selectionLimit: 5,
    });
    if (result.canceled) return;

    for await (const image of result.assets) {
      const imageData = await fetchImageFromUri(image.uri);
      const formData = new FormData();
      const uriArray = imageData.uri.split(".");
      const fileExtension = uriArray[uriArray.length - 1];
      formData.append("img", {
        uri: imageData.uri,
        type: `image/${fileExtension}`,
        name: `image.${fileExtension}`,
      } as any);
      callbackImages(formData, imageData.uri);
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
            color: "#7C7C7C",
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

const AlertBadage = ({ navigation }: { navigation: any }) => {
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
    backgroundColor: "#fff",
    flexDirection: "column",
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
    paddingBottom: 10,
    minHeight: 150,
    marginTop: 10,
    fontSize: 15,
    textAlignVertical: "top",
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

export default ArticleWrite;
