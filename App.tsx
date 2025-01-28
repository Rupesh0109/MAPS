import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    Text,
    Image,
    Button,
    AppState,
    View,
    FlatList,
    ScrollView,
    Switch,
} from 'react-native'
import RNAndroidNotificationListener from 'react-native-android-notification-listener'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from './styles'
import { BatteryOptEnabled, OpenOptimizationSettings } from '@saserinn/react-native-battery-optimization-check';

let interval: any = null

interface INotificationProps {
    time: string
    direction: string
    distance: string
    icon: string
    eta?: string // optional ETA
    totdistanc?: string // optional total distance
}

const Notification: React.FC<INotificationProps> = ({
    icon,
    time,
    direction,
    distance,
    eta,
    totdistanc,
}) => {
    // Split the time string into time, distance, and eta
    const [timeStr, distanceStr, etaStr] = time?.split(' · ') || []

    // Clean up any non-breaking spaces in the data
    const cleanText = (text: string) => text.replace(/\u00A0/g, ' ')

    return (
        <View style={styles.notificationWrapper}>
            <View style={styles.notification}>
                <View style={styles.imagesWrapper}>
                    {!!icon && (
                        <View style={styles.notificationIconWrapper}>
                            <Image
                                source={{ uri: icon }}
                                style={styles.notificationIcon}
                            />
                        </View>
                    )}
                </View>
                <View style={styles.notificationInfoWrapper}>
                    {!!timeStr && (
                        <Text style={styles.textInfo}>{`Time: ${cleanText(timeStr)}`}</Text>
                    )}
                    {!!distanceStr && (
                        <Text style={styles.textInfo}>{`Distance: ${cleanText(distanceStr)}`}</Text>
                    )}
                    {!!etaStr && (
                        <Text style={styles.textInfo}>{`ETA: ${cleanText(etaStr)}`}</Text>
                    )}
                    {!!eta && !etaStr && (
                        <Text style={styles.textInfo}>{`ETA: ${cleanText(eta)}`}</Text>
                    )}
                    {!!direction && (
                        <Text style={styles.textInfo}>{`Direction: ${cleanText(direction)}`}</Text>
                    )}
                    {!!distance && (
                        <Text style={styles.textInfo}>{`Distance: ${cleanText(distance)}`}</Text>
                    )}
                    {!!totdistanc && (
                        <Text style={styles.textInfo}>{`Total Distance: ${cleanText(totdistanc)}`}</Text>
                    )}
                </View>
            </View>
        </View>
    )
}

function App() {
    const [hasPermission, setHasPermission] = useState(false)
    const [hasBatteryPermission, setHasBatteryPermission] = useState(false);
    const [lastNotification, setLastNotification] = useState<any>(null)

    const handleOnPressPermissionButton = async () => {
        /**
         * Open the notification settings so the user
         * can enable it
         */
        RNAndroidNotificationListener.requestPermission()
    }
    const handleOnPressBatteryPermissionButton = () => {
        OpenOptimizationSettings();
    };

    const handleAppStateChange = async (
        nextAppState: string,
        force = false
    ) => {
        if (nextAppState === 'active' || force) {
            const status =
                await RNAndroidNotificationListener.getPermissionStatus()
            setHasPermission(status !== 'denied')

            const batteryStatus = await BatteryOptEnabled();
            setHasBatteryPermission(!batteryStatus);
        }
    }

    const handleCheckNotificationInterval = async () => {
        const lastStoredNotification = await AsyncStorage.getItem(
            '@mapsNotification'
        )

        if (lastStoredNotification) {
            /**
             * As the notification is a JSON string,
             * here I just parse it
             */
            setLastNotification(JSON.parse(lastStoredNotification))
        }
    }

    useEffect(() => {
        clearInterval(interval)

        /**
         * Just setting an interval to check if
         * there is a notification in AsyncStorage
         * so I can show it in the application
         */
        interval = setInterval(handleCheckNotificationInterval, 1000)

        const listener = AppState.addEventListener(
            'change',
            handleAppStateChange
        )

        handleAppStateChange('', true)

        return () => {
            clearInterval(interval)
            listener.remove()
        }
    }, [])

    const hasGroupedMessages =
        lastNotification &&
        lastNotification.groupedMessages &&
        lastNotification.groupedMessages.length > 0

    // // Debugging: Log the last notification
    // useEffect(() => {
    //     console.log('Last Notification:', lastNotification)
    // }, [lastNotification])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.buttonWrapper}>
                <Text
                    style={[
                        styles.permissionStatus,
                        { color: hasPermission ? 'green' : 'red' },
                    ]}>
                    {hasPermission
                        ? 'Allowed to handle notifications'
                        : 'NOT allowed to handle notifications'}
                </Text>
                {(!hasPermission)?
                <Button
                title="Open Configuration"
                onPress={handleOnPressPermissionButton}
                disabled={hasPermission}
            />
                :null}
                
            
                <Text
                    style={[
                        styles.permissionStatus,
                        { color: hasBatteryPermission ? 'green' : 'red' },
                    ]}>
                    {hasBatteryPermission
                        ? 'Battery optimization disabled'
                        : 'Battery optimization not disabled'}
                </Text>
                {(!hasBatteryPermission)?
                <Button
                title="Open Battery Optimization"
                onPress={handleOnPressBatteryPermissionButton}
                disabled={hasBatteryPermission}
                />
                :null}
            </View>

            <View style={styles.notificationsWrapper}>
                {lastNotification && !hasGroupedMessages && (
                    <ScrollView style={styles.scrollView}>
                        <Notification {...lastNotification} />
                    </ScrollView>
                )}
                {lastNotification && hasGroupedMessages && (
                    <FlatList
                        data={lastNotification.groupedMessages}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Notification
                                app={lastNotification.app}
                                {...item}
                            />
                        )}
                    />
                )}
            </View>
            
            
        </SafeAreaView>
    )
}

export default App
