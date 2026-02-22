import type { CapacitorConfig } from '@capacitor/cli';

let config: CapacitorConfig = {
    appId: 'com.wordquest.online',
    appName: 'WordQuest Online',
    webDir: 'packages/client/dist',
    server: {
        url: 'https://wordquest-online.onrender.com',
        cleartext: true
    },
    android: {
        buildOptions: {
            keystorePath: undefined,
            keystoreAlias: undefined
        }
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#1a1a2e'
        }
    }
};

export default config;
