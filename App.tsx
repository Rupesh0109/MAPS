import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

let interval: any = null;

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
    icon,
    time,
    direction,
    distance,
    eta,
    totdistanc,
    text,
}) => {
    const [timeStr, distanceStr, etaStr] = time?.split(' · ') || [];
    const cleanText = (text: string) => text.replace(/\u00A0/g, ' ');

    return (
        <View style={styles.notificationWrapper}>
            <View style={styles.notification}>
                <View style={styles.imagesWrapper}>
                    {!!icon && (
                        <View style={styles.notificationIconWrapper}>
                            <Image source={{ uri: icon }} style={styles.notificationIcon} />
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
                    {!!text && <Text style={styles.textInfo}>{text}</Text>}
                </View>
            </View>
        </View>
    );
};

function App() {
    const [hasPermission, setHasPermission] = useState(false);
    const [lastNotification, setLastNotification] = useState<any>(null);
    const [selectedApp, setSelectedApp] = useState<string>('com.google.android.apps.maps');
    const [appEnabled, setAppEnabled] = useState({
        maps: true,
        phone: false,
        whatsapp: false,
        other: false,
    });

    const handleOnPressPermissionButton = async () => {
        RNAndroidNotificationListener.requestPermission();
    };

    const fetchLatestNotification = async () => {
        console.log("Fetching latest notification...");
        try {
            const lastStoredNotification =
                selectedApp === 'com.google.android.apps.maps'
                    ? await AsyncStorage.getItem('@navigationNotification')
                    : await AsyncStorage.getItem('@otherNotification');

            if (lastStoredNotification) {
                const notificationData = JSON.parse(lastStoredNotification);
                console.log("Fetched notification data:", notificationData);
                setLastNotification({ ...notificationData }); // Create a new reference
            } else {
                setLastNotification(null);
            }
        } catch (error) {
            console.error('Failed to fetch notification:', error);
        }
    };

    const handleAppStateChange = async (nextAppState: string, force = false) => {
        console.log("App state changed to:", nextAppState);
        if (nextAppState === 'active' || force) {
            const status = await RNAndroidNotificationListener.getPermissionStatus();
            setHasPermission(status !== 'denied');

            // Always fetch notifications and force state update
            fetchLatestNotification()
                .then(() => console.log("Fetched notifications after app became active."))
                .catch(err => console.error("Error fetching notifications on state change:", err));
        }
    };

    useEffect(() => {
        clearInterval(interval);
        if (AppState.currentState === 'active') {
            interval = setInterval(() => {
                fetchLatestNotification();
            }, 1000);
        }

        const listener = AppState.addEventListener('change', handleAppStateChange);
        handleAppStateChange('', true);

        return () => {
            clearInterval(interval);
            listener.remove();
        };
    }, [selectedApp]);

    const toggleAppNotifications = (app: string, value: boolean) => {
        setAppEnabled(prev => ({ ...prev, [app]: value }));
    };

    const hasGroupedMessages =
        lastNotification &&
        lastNotification.groupedMessages &&
        lastNotification.groupedMessages.length > 0;

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
                <Button
                    title="Open Configuration"
                    onPress={handleOnPressPermissionButton}
                    disabled={hasPermission}
                />
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
                {lastNotification && !hasGroupedMessages && appEnabled.maps && (
                    <ScrollView style={styles.scrollView}>
                        <Notification {...lastNotification} />
                    </ScrollView>
                )}
                {lastNotification && hasGroupedMessages && appEnabled.maps && (
                    <FlatList
                        data={lastNotification.groupedMessages}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => <Notification {...item} />}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

export default App;
