import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.compuss.taxi.driver.starter',
  appName: 'driver',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
