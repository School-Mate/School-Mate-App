import React, { useEffect } from "react";
import "react-native-gesture-handler";
import appsFlyer from "react-native-appsflyer";

const InitializeSDKHandler = () => {
  useEffect(() => {
    appsFlyer.initSdk({
      devKey: "G42f2RHv4qR5kjWWPattHU",
      isDebug: true,
      appId: "6473076162",
      onDeepLinkListener: true, //Optional
      timeToWaitForATTUserAuthorization: 10, //for iOS 14.5
    });
  }, []);

  return null;
};

export default InitializeSDKHandler;
