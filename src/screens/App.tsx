import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, Button, View, Switch, ScrollView, FlatList, AppState } from 'react-native';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { BatteryOptEnabled, OpenOptimizationSettings } from '@saserinn/react-native-battery-optimization-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveSwitchState, getSwitchState } from '../utils/storage';
import MapsNotification from '../components/MapsNotification';
import WhNotification from '../components/WhNotification';
import styles from '../styles';

const App = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [hasBatteryPermission, setHasBatteryPermission] = useState(false);
    const [whatsapppermission, setWhatsappPermission] = useState(false);
    const [phonepermission, setPhonePermission] = useState(false);
    const [otherpermission, setOtherPermission] = useState(false);

    const [lastMapsNotification, setLastMapsNotification] = useState<any>(null);
    const [lastWhatsappNotification, setLastWhatsappNotification] = useState<any>(null);
    const [lastPhoneNotification, setLastPhoneNotification] = useState<any>(null);
    const [lastOtherNotification, setLastOtherNotification] = useState<any>(null);


    const handleOnPressPermissionButton = () => {
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
    const initialLoadRef = useRef(true); 
    const [initialLoadComplete, setInitialLoadComplete] = useState(false); 
    useEffect(() => {
        const loadSwitchStates = async () => {
            try {
                const [ 
                    whatsappState, 
                    phoneState, 
                    otherState 
                ] = await Promise.all([
                    getSwitchState('@whatsappPermission'),
                    getSwitchState('@phonePermission'),
                    getSwitchState('@otherPermission'),
                ]);

                setWhatsappPermission(whatsappState);
                setPhonePermission(phoneState);
                setOtherPermission(otherState);
                setInitialLoadComplete(true); 
            } catch (error) {
                console.error('Error loading switch states:', error); 
                setInitialLoadComplete(true); // Set to true even on error
            }

            initialLoadRef.current = false; 
        };
        
        loadSwitchStates();
        fetchMapsNotification();
        fetchWhatsappNotification();
        handleAppStateChange('',true);
    }, []);

    useEffect(() => {
        saveSwitchState('@whatsappPermission', whatsapppermission);
    }, [whatsapppermission]);
    useEffect(() => {
        saveSwitchState('@phonePermission', phonepermission);
    },[phonepermission])
    useEffect(() => {
        saveSwitchState('@otherPermission', otherpermission);
    },[otherpermission])
    useEffect(() => {
        const fetchAllNotifications = async () => {
            await fetchMapsNotification();
            if (whatsapppermission) await fetchWhatsappNotification();
            if (phonepermission) await fetchphoneNotification();
            if (otherpermission) await fetchotherNotification();
        };

        const interval = setInterval(fetchAllNotifications, 500);

        const listener = AppState.addEventListener('change', handleAppStateChange);

        handleAppStateChange('', true);

        return () => {
            clearInterval(interval);
            listener.remove();
        };
    }, [whatsapppermission, phonepermission, otherpermission]);

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
                    <Switch value={whatsapppermission} onValueChange={setWhatsappPermission} />
                    <Text>WhatsApp</Text>
                </View>

                <View style={styles.switchWrapper}>
                    <Switch value={phonepermission} onValueChange={setPhonePermission} />
                    <Text>Phone</Text>
                </View>

                <View style={styles.switchWrapper}>
                    <Switch value={otherpermission} onValueChange={setOtherPermission} />
                    <Text>Other</Text>
                </View>

                <View style={styles.notificationsWrapper}>
                    {lastMapsNotification && <MapsNotification {...lastMapsNotification} />}
                </View>

                {whatsapppermission && lastWhatsappNotification && (
                    <View>
                        <WhNotification {...lastWhatsappNotification} />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default App;
