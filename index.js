import { AppRegistry } from 'react-native';
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { name as appName } from './app.json';
import App from './src/screens/App';
import DeviceInfo from 'react-native-device-info';

const getAppName = (packageName) => {
  try {
    return DeviceInfo.getApplicationName(packageName) || packageName;
  } catch (error) {
    console.error("Error fetching app name for:", packageName, error);
    return packageName; // Fallback to package name
  }
};
const headlessNotificationListener = async ({ notification }) => {
  if (notification) {
    try {
      const data = JSON.parse(notification);
      console.log(data);

      let storageKey = '';
      let appData = {};
      const phoneApps = [
        'com.google.android.dialer',
        'com.samsung.android.dialer',
        'com.oneplus.communication.data',
        'com.android.dialer',
        'com.oppo.communication',
        'com.vivo.telephony',
        'com.realme.dialer',
        'com.motorola.dialer',
        'com.sonymobile.android.dialer',
        'com.asus.contacts',
        'com.lge.dialer',
        'com.zte.dialer'
      ];

      const appName = getAppName(data.app); // Dynamically get app name

      if (data.app === 'com.google.android.apps.maps') {
        storageKey = '@mapsNotification';
        appData = {
          icon: (data.iconLarge==""||!data.iconLarge)?data.icon:data.iconLarge,
          text: data.text,
          app: appName,
          direction: data.text,
          distance: data.title,
          time: data.subText?.split(' · ')[0] || '',
          totdistanc: data.subText?.split(' · ')[1] || '',
          eta: data.subText?.split(' · ')[2]?.replace(' ETA', '') || '',
        };
      } 
      else if (data.app === 'com.whatsapp') {
        storageKey = '@whatsappNotification';
        appData = {
            icon: (data.iconLarge==""||!data.iconLarge)?data.icon:data.iconLarge,
            text: data.text,
            app: appName,
            timeString: data.time || '',
            messages: data.groupedMessages && data.groupedMessages.length > 0 
                      ? data.groupedMessages
                      : [{"title":data.title,"text":data.text}]  
        };
      }    
      else if (phoneApps.includes(data.app)) {
        storageKey = '@phoneNotification';
        appData = {
          icon: (data.iconLarge == "" || !data.iconLarge) ? data.icon : data.iconLarge,
          text: data.text,
          app: appName,
          time: data.subText || '',
          title: data.title
        };
      }
      else {
        storageKey = '@otherNotification';
        appData = {
          icon: (data.iconLarge==""||!data.iconLarge)?data.icon:data.iconLarge,
          text: data.text,
          app: appName,
          time: data.subText || '',
          title: data.title
        };
      }

      await AsyncStorage.setItem(storageKey, JSON.stringify(appData));

    } catch (error) {
      console.error('Error storing notification:', error);
    }
  }
};

AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener
);

AppRegistry.registerComponent(appName, () => App);