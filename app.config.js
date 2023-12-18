export default {
  expo: {
    name: "스쿨메이트",
    slug: "schoolmate-app",
    scheme: "schoolmate",
    version: "1.0.14",
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
      config: {
        usesNonExemptEncryption: false,
      },
      associatedDomains: ["applinks:app.schoolmate.kr"],
      buildNumber: "1.0.14",
      infoPlist: {
        NSCameraUsageDescription:
          "게시글, 학교인증, 프로필에 사진을 업로드하기 위해 카메라에 접근합니다.",
        NSPhotoLibraryUsageDescription:
          "게시글, 학교인증, 프로필에 사진을 업로드하기 위해 사진 라이브러리에 접근합니다.",
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
      versionCode: 15,
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
    ],
  },
};
