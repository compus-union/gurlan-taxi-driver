import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.novda.driver.app",
  appName: "Novda Driver",
  webDir: "dist",
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_novda_ico",
      sound: "novda_driver_notification.mp3",
    },
    // BackgroundRunner: {
    //   label: "com.novda.driver.app.notification",
    //   src: "runners/runner.js",
    //   event: "",
    //   repeat: true,
    //   interval: 30,
    //   autoStart: true,
    // },
  },
};

export default config;
