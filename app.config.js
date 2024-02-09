export default {
  expo: {
    name: "스쿨메이트",
    owner: "codest-kr",
    slug: "schoolmate-app",
    scheme: "schoolmate",
    version: "1.3.4",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: process.env.SENTRY_ORGANIZATION,
            project: process.env.SENTRY_PROJECT,
          },
        },
      ],
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#2545ED",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "kr.codest.schoolmateapp",
      usesAppleSignIn: true,
      config: {
        usesNonExemptEncryption: false,
      },
      associatedDomains: [
        "applinks:app.schoolmate.kr",
        "applinks:schoolmate.onelink.me",
      ],
      buildNumber: "1.3.4",
      infoPlist: {
        NSCameraUsageDescription:
          "게시글, 학교인증, 프로필에 사진을 업로드하기 위해 카메라에 접근합니다.",
        NSPhotoLibraryUsageDescription:
          "게시글, 학교인증, 프로필에 사진을 업로드하기 위해 사진 라이브러리에 접근합니다.",
        CFBundleDevelopmentRegion: "ko",
        NSUserTrackingUsageDescription:
          "광고를 표시하고 사용자의 활동을 추적하기 위해 사용됩니다.",
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_APPLE_JSON,
    },
    android: {
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "com.google.android.gms.permission.AD_ID",
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#2545ED",
      },
      package: "kr.codest.schoolmateapp",
      versionCode: 22,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "https",
              host: "app.schoolmate.kr",
              pathPrefix: "/view",
            },
            {
              scheme: "https",
              host: "schoolmate.onelink.me",
              pathPrefix: "/xwaO",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
          autoVerify: true, // required to work on newer android versions
        },
      ],
    },
    extra: {
      eas: {
        projectId: "b6290774-e9df-4309-80fe-a1f3ba06b603",
      },
    },
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission:
            "게시글, 학교인증, 프로필에 사진을 업로드하기 위해 사진 라이브러리에 접근합니다.",
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      ["sentry-expo"],
      ["react-native-appsflyer", {}],
      "@react-native-firebase/app",
      [
        "react-native-fbsdk-next",
        {
          appID: "346813614779840",
          clientToken: "96251ff184511caf82c19843218319a2",
          displayName: "스쿨메이트",
          scheme: "fb346813614779840",
          advertiserIDCollectionEnabled: false,
          autoLogAppEventsEnabled: false,
          isAutoInitEnabled: true,
          iosUserTrackingPermission:
            "광고를 표시하고 사용자의 활동을 추적하기 위해 사용됩니다.",
        },
      ],
      [
        "expo-tracking-transparency",
        {
          userTrackingPermission:
            "광고를 표시하고 사용자의 활동을 추적하기 위해 사용됩니다.",
        },
      ],
      [
        "@react-native-seoul/kakao-login",
        {
          kakaoAppKey: "02fe35d1477b01c2556b9797dbd098bc", // 필수
          kotlinVersion: "1.9.0", // Android Only, Optional, Expo 내부 패키지들과의 충돌이 있어 테스트 결과 1.5.10은 문제가 없었습니다. 지정 안하면 1.5.10으로 설정됩니다.
        },
      ],
      "expo-apple-authentication",
    ],
  },
};
