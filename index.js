import { AppRegistry } from 'react-native';
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { name as appName } from './app.json';
import App from './App';


const headlessNotificationListener = async ({ notification }) => {
  if (notification) {
    try {
      const data = JSON.parse(notification);
      console.log(data);

      let storageKey = '';
      let appData = {};

      if (data.app === 'com.google.android.apps.maps') {
        storageKey = '@mapsNotification';
        appData = {
          icon: data.iconLarge,
          text: data.text,
          app: data.app,
          time: data.subText?.split(' · ')[0] || '',
          distance: data.subText?.split(' · ')[1] || '',
          eta: data.subText?.split(' · ')[2]?.replace(' ETA', '') || '',
        };
      } 
      else if (data.app === 'com.whatsapp') {
        storageKey = '@whatsappNotification';
        appData = {
            icon: data.iconLarge,
            text: data.text,
            app: data.app,
            time: data.subText || '',
            messages: data.groupedMessages && data.groupedMessages.length > 0 
                      ? data.groupedMessages
                      : [data.text]  
        };
    }    
      else if (data.app === 'com.android.phone') {
        storageKey = '@phoneNotification';
        appData = {
          icon: data.iconLarge,
          text: data.text,
          app: data.app,
          time: data.subText || '',
          title:data.title
        };
      } else {
        storageKey = '@otherNotification';
        appData = {
          icon: data.iconLarge,
          text: data.text,
          app: data.app,
          time: data.subText || '',
          title:data.title
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