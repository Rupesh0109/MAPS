import { AppRegistry } from 'react-native'
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { name as appName } from './app.json'
import App from './App'

const headlessNotificationListener = async ({ notification }) => {
    if (notification) {
        try {
            const data = JSON.parse(notification)
            // console.log(data)
            if (data.app === "com.google.android.apps.maps") {
                let timeStr, distanceStr, etaStr;
                
                // Split the time string into time, distance, and eta
                const timeData = data.subText?.split(' · ') || []
                timeStr = timeData[0]
                distanceStr = timeData[1]
                etaStr = timeData[2]

                // Remove " ETA" from the eta string if it exists
                const cleanedEtaStr = etaStr ? etaStr.replace(' ETA', '') : ''

                const necdata = {
                    icon: data.iconLarge,
                    time: timeStr,
                    direction: data.text,
                    distance: data.title,
                    totdistanc:distanceStr,
                    eta: cleanedEtaStr,
                };

                await AsyncStorage.setItem('@lastNotification', JSON.stringify(necdata))
                //console.log('Notification stored:', necdata)
            }
        } catch (error) {
            console.error('Error storing notification:', error)
        }
    }
}

AppRegistry.registerHeadlessTask(
    RNAndroidNotificationListenerHeadlessJsName,
    () => headlessNotificationListener
)

AppRegistry.registerComponent(appName, () => App)