import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    SafeAreaView,
    Text,
    Button,
    View,
    Switch,
    AppState,
    ScrollView,
    FlatList,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { BatteryOptEnabled, OpenOptimizationSettings } from '@saserinn/react-native-battery-optimization-check';

interface INotificationProps {
    time?: string;
    direction?: string;
    distance?: string;
    icon: string;
    eta?: string;
    totdistanc?: string;
    text?: string;
    app?: string;
    groupedMessages?: any[];
}

const Notification: React.FC<INotificationProps> = ({
    icon = '',
    time = '',
    direction = '',
    distance = '',
    eta = '',
    totdistanc = '',
    text = '',
}) => {
    const [timeStr, distanceStr, etaStr] = time.split(' · ') || [];
    const cleanText = (input: string) => input.replace(/\u00A0/g, ' ');

    return (
        <View style={styles.notificationWrapper}>
            <View style={styles.notification}>
                <View style={styles.imagesWrapper}>
                    {icon ? (
                        <View style={styles.notificationIconWrapper}>
                            <Image source={{ uri: icon }} style={styles.notificationIcon} />
                        </View>
                    ) : null}
                </View>
                <View style={styles.notificationInfoWrapper}>
                    {timeStr ? (
                        <Text style={styles.textInfo}>{`Time: ${cleanText(timeStr)}`}</Text>
                    ) : null}
                    {distanceStr ? (
                        <Text style={styles.textInfo}>{`Distance: ${cleanText(distanceStr)}`}</Text>
                    ) : null}
                    {etaStr ? (
                        <Text style={styles.textInfo}>{`ETA: ${cleanText(etaStr)}`}</Text>
                    ) : eta ? (
                        <Text style={styles.textInfo}>{`ETA: ${cleanText(eta)}`}</Text>
                    ) : null}
                    {direction ? (
                        <Text style={styles.textInfo}>{`Direction: ${cleanText(direction)}`}</Text>
                    ) : null}
                    {distance ? (
                        <Text style={styles.textInfo}>{`Distance: ${cleanText(distance)}`}</Text>
                    ) : null}
                    {totdistanc ? (
                        <Text style={styles.textInfo}>{`Total Distance: ${cleanText(totdistanc)}`}</Text>
                    ) : null}
                    {text ? <Text style={styles.textInfo}>{text}</Text> : null}
                </View>
            </View>
        </View>
    );
};

const App = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [hasBatteryPermission, setHasBatteryPermission] = useState(false);
    const [lastNotification, setLastNotification] = useState<any>(null);
    const [selectedApp, setSelectedApp] = useState<string>('com.google.android.apps.maps');
    const [appEnabled, setAppEnabled] = useState({
        maps: true,
        phone: false,
        whatsapp: false,
        other: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const intervalRef = useRef<any>(null);

    const handleOnPressPermissionButton = () => {
        RNAndroidNotificationListener.requestPermission();
    };

    const handleOnPressBatteryPermissionButton = () => {
        OpenOptimizationSettings();
    };

    const fetchLatestNotification = useCallback(async () => {
        // console.log("Fetching latest notification...");
        try {
            const storageKey =
                selectedApp === 'com.google.android.apps.maps'
                    ? '@navigationNotification'
                    : '@otherNotification';

            const lastStoredNotification = await AsyncStorage.getItem(storageKey);

            if (lastStoredNotification) {
                const notificationData = JSON.parse(lastStoredNotification);
                // console.log("Fetched notification data:", notificationData);
                setLastNotification({ ...notificationData });
            } else {
                setLastNotification(null);
            }
        } catch (error) {
            console.error('Failed to fetch notification:', error);
            Alert.alert('Error', 'Failed to fetch notification data.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedApp]);

    const handleAppStateChange = useCallback(
        async (nextAppState: string, force = false) => {
            console.log("App state changed to:", nextAppState);
            if (nextAppState === 'active' || force) {
                try {
                    const status = await RNAndroidNotificationListener.getPermissionStatus();
                    const batteryStatus = await BatteryOptEnabled();
                    setHasPermission(status !== 'denied');
                    setHasBatteryPermission(!batteryStatus);
                    fetchLatestNotification();
                } catch (error) {
                    console.error('Error handling app state change:', error);
                }
            }
        },
        [fetchLatestNotification]
    );

    useEffect(() => {
        if (AppState.currentState === 'active') {
            intervalRef.current = setInterval(() => {
                fetchLatestNotification();
            }, 1000);
        }

        const listener = AppState.addEventListener('change', handleAppStateChange);
        handleAppStateChange('', true);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            listener.remove();
        };
    }, [handleAppStateChange]);

    const toggleAppNotifications = (app: string, value: boolean) => {
        setAppEnabled(prev => ({ ...prev, [app]: value }));
    };

    const hasGroupedMessages =
        lastNotification?.groupedMessages?.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            {/* Notification Permission */}
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

            {/* App Selection */}
            <View style={styles.appSelectionWrapper}>
                <Text style={styles.header}>Select App for Notifications</Text>
                <View style={styles.switchContainer}>
                    <View style={styles.switchWrapper}>
                        <Switch
                            value={appEnabled.maps}
                            onValueChange={value => toggleAppNotifications('maps', value)}
                        />
                        <Text>Google Maps</Text>
                    </View>
                    <View style={styles.switchWrapper}>
                        <Switch
                            value={appEnabled.phone}
                            onValueChange={value => toggleAppNotifications('phone', value)}
                        />
                        <Text>Phone</Text>
                    </View>
                    <View style={styles.switchWrapper}>
                        <Switch
                            value={appEnabled.whatsapp}
                            onValueChange={value => toggleAppNotifications('whatsapp', value)}
                        />
                        <Text>WhatsApp</Text>
                    </View>
                    <View style={styles.switchWrapper}>
                        <Switch
                            value={appEnabled.other}
                            onValueChange={value => toggleAppNotifications('other', value)}
                        />
                        <Text>Other</Text>
                    </View>
                </View>
            </View>

            {/* Display Notifications */}
            <View style={styles.notificationsWrapper}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : lastNotification && appEnabled.maps ? (
                    hasGroupedMessages ? (
                        <FlatList
                            data={lastNotification.groupedMessages}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => <Notification {...item} />}
                        />
                    ) : (
                        <ScrollView style={styles.scrollView}>
                            <Notification {...lastNotification} />
                        </ScrollView>
                    )
                ) : (
                    <Text style={styles.noNotificationText}>No notifications available.</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default App;
