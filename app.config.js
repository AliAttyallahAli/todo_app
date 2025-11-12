export default {
  expo: {
    name: "ZouDou-Souk",
    slug: "zoudou-souk-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#2c5530"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.zoudousouk.mobile",
      config: {
        usesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#2c5530"
      },
      package: "com.zoudousouk.mobile",
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow ZouDou-Souk to access your camera to scan QR codes and take photos of your products."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with other users and add photos to your products.",
          "cameraPermission": "Allow ZouDou-Souk to access your camera to take photos of your products and documents."
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow ZouDou-Souk to use your location for delivery services and local product discovery."
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "your-project-id-here"
      }
    }
  }
};