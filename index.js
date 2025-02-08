import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { name as appName } from './app.json';
import App from './src/screens/App';
import DeviceInfo from 'react-native-device-info';
import store from './src/redux/store';
import {
  setMapsNotification,
  setWhatsappNotification,
  setPhoneNotification,
  setOtherNotification,
} from './src/redux/notificationSlice';

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

      const appName = getAppName(data.app);

      let appData = {};

      if (data.app === 'com.google.android.apps.maps') {
        appData = {
          icon: data.iconLarge || data.icon,
          text: data.text,
          app: appName,
          direction: data.text,
          distance: data.title,
          time: data.subText?.split(' · ')[0] || '',
          totalDistance: data.subText?.split(' · ')[1] || '',
          eta: data.subText?.split(' · ')[2]?.replace(' ETA', '') || '',
        };
        store.dispatch(setMapsNotification(appData));
      } 
      else if (data.app === 'com.whatsapp') {
        appData = {
          icon: data.iconLarge || data.icon,
          text: data.text,
          app: appName,
          timeString: data.time || '',
          messages: data.groupedMessages?.length 
                    ? data.groupedMessages 
                    : [{ title: data.title, text: data.text }],
        };
        store.dispatch(setWhatsappNotification(appData));
      }    
      else if (phoneApps.includes(data.app)) {
        appData = {
          icon: data.iconLarge || data.icon,
          text: data.text,
          app: appName,
          time: data.subText || '',
          title: data.title,
        };
        store.dispatch(setPhoneNotification(appData));
      }
      else {
        appData = {
          icon: data.iconLarge || data.icon,
          text: data.text,
          app: appName,
          time: data.subText || '',
          title: data.title,
        };
        store.dispatch(setOtherNotification(appData));
      }
    } catch (error) {
      console.error('Error processing notification:', error);
    }
  }
};

// Wrap App with Redux Provider
const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);

AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => headlessNotificationListener
);
