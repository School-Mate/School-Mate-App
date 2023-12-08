export default {
  expo: {
    name: "스쿨메이트",
    slug: "schoolmate-app",
    scheme: "schoolmate",
    version: "1.0.7",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#2545ED",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "kr.codest.schoolmateapp",
      config: {
        usesNonExemptEncryption: false,
      },
      associatedDomains: ["applinks:app.schoolmate.kr"],
      buildNumber: "1.0.7",
      infoPlist: {
        NSCameraUsageDescription: "카메라를 사용하여 사진을 찍습니다.",
        NSPhotoLibraryUsageDescription:
          "사진을 불러오기 위해 사진 라이브러리에 접근합니다.",
        CFBundleDevelopmentRegion: "ko",
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
      versionCode: 8,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "https",
              host: "app.schoolmate.kr",
              pathPrefix: "/",
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
            "사진을 불러오기 위해 사진 라이브러리에 접근합니다.",
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
    ],
  },
};
