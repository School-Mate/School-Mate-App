import { StackNavigationProp } from "@react-navigation/stack";
import { Image, Platform, Pressable, StyleSheet, Text } from "react-native";

const HeaderLeftCancel = ({
  navigation,
}: {
  navigation: StackNavigationProp<any>;
}) => {
  return (
    <Pressable style={styles.container} onPress={() => navigation.goBack()}>
      <Image
        source={require("../../../assets/icons/cancel.png")}
        style={{
          width: 17,
          height: 17,
        }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
  },
});

export { HeaderLeftCancel };
