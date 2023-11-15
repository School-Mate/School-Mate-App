import React from "react";
import { ToastProvider } from "react-native-toast-notifications";
import { EvilIcons, AntDesign } from "@expo/vector-icons";

export default function SchoolMateToastProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <ToastProvider
      placement="top"
      duration={5000}
      animationType="slide-in"
      animationDuration={250}
      successColor="grey"
      dangerColor="grey"
      warningColor="grey"
      normalColor="grey"
      successIcon={<EvilIcons name="check" size={20} color="#81c147" />}
      dangerIcon={<AntDesign name="close" size={20} color="#f05650" />}
      warningIcon={<AntDesign name="close" size={20} color="#f05650" />}
      textStyle={{ fontSize: 15, opacity: 1 }}
      offset={50} // offset for both top and bottom toasts
      offsetTop={30}
      offsetBottom={90}
      swipeEnabled={true}
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 10,
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 20,
      }}
    >
      {children}
    </ToastProvider>
  );
}
