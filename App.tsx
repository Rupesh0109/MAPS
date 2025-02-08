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

interface MNotificationProps {
    time: string
    direction: string
    distance: string
    icon: string
    eta?: string // optional ETA
    totdistanc?: string // optional total distance
}

interface WNotificationProps{

icon: string
text: string
app: string
timeString: string
messages:string[]
}

const WhNotification:React.FC<WNotificationProps>=({
icon,
text,
app,
timeString,
messages,
})=>{

const date= new Date(timeString);
const cleanText = (text: string) => text.replace(/\u00A0/g, ' ')
const msg=JSON.parse(messages);
console.log("MSG",msg);
//date.toLocaleString()
return(

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
                    {!!timeString && (
                        <Text style={styles.textInfo}>{`Time: ${cleanText(timeString)}`}</T

const MapsNotification: React.FC<MNotificationProps> = ({
    icon,
    time,
    direction,
    distance,
    eta,
    totdistanc,
}) => {z
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
    const [hasPermission, setHasPermission] = useState(false);
    const [hasBatteryPermission, setHasBatteryPermission] = useState(false);
    const [whatsapppermission, setwhatsapppermission] = useState(false);
    const [phonepermission, setphonepermission] = useState(false);
    const [otherpermission, setotherpermission] = useState(false);

    const [lastMapsNotification, setLastMapsNotification] = useState<any>(null);
    const [lastWhatsappNotification, setLastWhatsappNotification] = useState<any>(null);
    const [lastPhoneNotification, setLastPhoneNotification] = useState<any>(null);
    const [lastOtherNotification, setLastOtherNotification] = useState<any>(null);

    const handleOnPressPermissionButton = async () => {
        RNAndroidNotificationListener.requestPermission();
    };

    const handleOnPressBatteryPermissionButton = () => {
        OpenOptimizationSettings();
    };

    const handleAppStateChange = async (nextAppState: string, force = false) => {
        if (nextAppState === 'active' || force) {
            const status = await RNAndroidNotificationListener.getPermissionStatus();
            setHasPermission(status !== 'denied');

            const batteryStatus = await BatteryOptEnabled();
            setHasBatteryPermission(!batteryStatus);
        }
    };

    const fetchMapsNotification = async () => {
        const lastStoredMapsNotification = await AsyncStorage.getItem('@mapsNotification');
        if (lastStoredMapsNotification) {
            setLastMapsNotification(JSON.parse(lastStoredMapsNotification));
        }
    };

    const fetchWhatsappNotification = async () => {
        const lastStoredWhatsappNotification = await AsyncStorage.getItem('@whatsappNotification');
        if (lastStoredWhatsappNotification) {
            setLastWhatsappNotification(JSON.parse(lastStoredWhatsappNotification));
        }
    };

    const fetchphoneNotification = async () => {
        const lastStoredPhoneNotification = await AsyncStorage.getItem('@phoneNotification');
        if (lastStoredPhoneNotification) {
            setLastPhoneNotification(JSON.parse(lastStoredPhoneNotification));
        }
    };

    const fetchotherNotification = async () => {
        const lastStoredOtherNotification = await AsyncStorage.getItem('@otherNotification');
        if (lastStoredOtherNotification) {
            setLastOtherNotification(JSON.parse(lastStoredOtherNotification));
        }
    };

    useEffect(() => {
        const fetchAllNotifications = async () => {
            await fetchMapsNotification();
            if (whatsapppermission) await fetchWhatsappNotification();
            if (phonepermission) await fetchphoneNotification();
            if (otherpermission) await fetchotherNotification();
        };

        const interval = setInterval(fetchAllNotifications, 1000);

        const listener = AppState.addEventListener('change', handleAppStateChange);

        handleAppStateChange('', true);

        return () => {
            clearInterval(interval);
            listener.remove();
        };
    }, [whatsapppermission, phonepermission, otherpermission]);

    const hasGroupedMessages =
        lastWhatsappNotification &&
        lastWhatsappNotification.groupedMessages &&
        lastWhatsappNotification.groupedMessages.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.buttonWrapper}>
                    <Text style={[styles.permissionStatus, { color: hasPermission ? 'green' : 'red' }]}>
                        {hasPermission ? 'Allowed to handle notifications' : 'NOT allowed to handle notifications'}
                    </Text>
                    {!hasPermission && (
                        <Button
                            title="Open Configuration"
                            onPress={handleOnPressPermissionButton}
                            disabled={hasPermission}
                        />
                    )}

                    <Text style={[styles.permissionStatus, { color: hasBatteryPermission ? 'green' : 'red' }]}>
                        {hasBatteryPermission ? 'Battery optimization disabled' : 'Battery optimization not disabled'}
                    </Text>
                    {!hasBatteryPermission && (
                        <Button
                            title="Open Battery Optimization"
                            onPress={handleOnPressBatteryPermissionButton}
                            disabled={hasBatteryPermission}
                        />
                    )}
                </View>

                <View style={styles.switchWrapper}>
                    <Switch value={whatsapppermission} onValueChange={setwhatsapppermission} />
                    <Text>WhatsApp</Text>
                </View>

                <View style={styles.switchWrapper}>
                    <Switch value={phonepermission} onValueChange={setphonepermission} />
                    <Text>Phone</Text>
                </View>

                <View style={styles.switchWrapper}>
                    <Switch value={otherpermission} onValueChange={setotherpermission} />
                    <Text>Other</Text>
                </View>

                {/* Maps Display Section */}
                <View style={styles.notificationsWrapper}>
                    {lastMapsNotification && (
                        <ScrollView style={styles.scrollView}>
                            <MapsNotification {...lastMapsNotification} />
                        </ScrollView>
                    )}
                </View>

                 {/* WhatsApp Display Section */}
                {whatsapppermission && (
                    <View>
                        {lastWhatsappNotification && (
                            <ScrollView style={styles.scrollView}>
                                <WhNotification {...lastWhatsappNotification} />
                            </ScrollView>
                        )}
                        {lastWhatsappNotification && hasGroupedMessages && (
                            <FlatList
                                data={lastWhatsappNotification.groupedMessages}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <WhNotification
                                        app={lastWhatsappNotification.app}
                                        {...item}
                                    />
                                )}
                            />
                        )}
                    </View>
                )}
{/*
                
                {phonepermission && (
                    <View>
                        {lastPhoneNotification && (
                            <ScrollView style={styles.scrollView}>
                                <Notification {...lastPhoneNotification} />
                            </ScrollView>
                        )}
                    </View>
                )}

               
                {otherpermission && (
                    <View>
                        {lastOtherNotification && (
                            <ScrollView style={styles.scrollView}>
                                <Notification {...lastOtherNotification} />
                            </ScrollView>
                        )}
                    </View>
                )} 
                 
                 */}
    
            </ScrollView>
        </SafeAreaView>
    );
}

export default App;