import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, Button, View, Switch, ScrollView, AppState } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { BatteryOptEnabled, OpenOptimizationSettings } from '@saserinn/react-native-battery-optimization-check';
import { saveSwitchState, getSwitchState } from '../utils/storage';
import MapsNotification from '../components/MapsNotification';
import WhNotification from '../components/WhNotification';
import PhoneNotification from '../components/PhoneNotification';
import styles from '../styles';
import { RootState } from '../redux/store';
import { setWhatsappEnabled, setPhoneEnabled, setOtherEnabled } from '../redux/notificationSlice';

const App = () => {
    const dispatch = useDispatch();

    const [hasPermission, setHasPermission] = useState(false);
    const [hasBatteryPermission, setHasBatteryPermission] = useState(false);

    // Redux: Fetching notifications from the store
    const lastMapsNotification = useSelector((state: RootState) => state.notifications.mapsNotification);
    const lastWhatsappNotification = useSelector((state: RootState) => state.notifications.whatsappNotification);
    const lastPhoneNotification = useSelector((state: RootState) => state.notifications.phoneNotification);
    const lastOtherNotification = useSelector((state: RootState) => state.notifications.otherNotification);

    // Redux: Fetching switch states from the store
    const whatsapppermission = useSelector((state: RootState) => state.notifications.whatsappEnabled);
    const phonepermission = useSelector((state: RootState) => state.notifications.phoneEnabled);
    const otherpermission = useSelector((state: RootState) => state.notifications.otherEnabled);

    const handleOnPressPermissionButton = () => {
        RNAndroidNotificationListener.requestPermission();
    };

    const handleOnPressBatteryPermissionButton = async () => {
        OpenOptimizationSettings();
    
        // Check every second after returning from settings
        const interval = setInterval(async () => {
            const batteryStatus = await BatteryOptEnabled();
            const isDisabled = !batteryStatus;
    
            setHasBatteryPermission(isDisabled);  // ✅ Immediately update UI
    
            if (isDisabled) {
                clearInterval(interval); // ✅ Stop checking when the state is updated
            }
        }, 1000); // Poll every second
    
        // Stop polling after 10 seconds
        setTimeout(() => clearInterval(interval), 10000);
    };
    

    
    

    const handleAppStateChange = async (nextAppState: string, force = false) => {
        if (nextAppState === 'active' || force) {
            const status = await RNAndroidNotificationListener.getPermissionStatus();
            const batteryStatus = await BatteryOptEnabled();
            
            setHasBatteryPermission(!batteryStatus);  // ✅ Fix: Now correctly updates the UI
            setHasPermission(status !== 'denied');
        }
    };

    const initialLoadRef = useRef(true);

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

                dispatch(setWhatsappEnabled(whatsappState));
                dispatch(setPhoneEnabled(phoneState));
                dispatch(setOtherEnabled(otherState));
            } catch (error) {
                console.error('Error loading switch states:', error);
            }

            initialLoadRef.current = false;
        };

        loadSwitchStates();
        handleAppStateChange('', true);
    }, []);

    // Handle switch toggle and save to AsyncStorage
    const toggleSwitch = (type: 'whatsapp' | 'phone' | 'other', value: boolean) => {
        if (type === 'whatsapp') {
            dispatch(setWhatsappEnabled(value));
            saveSwitchState('@whatsappPermission', value);
        } else if (type === 'phone') {
            dispatch(setPhoneEnabled(value));
            saveSwitchState('@phonePermission', value);
        } else if (type === 'other') {
            dispatch(setOtherEnabled(value));
            saveSwitchState('@otherPermission', value);
        }
    };

    useEffect(() => {
        const listener1 = AppState.addEventListener('change', async (nextAppState) => {
            if (nextAppState === 'active') {
                const batteryStatus = await BatteryOptEnabled();
                setHasBatteryPermission(!batteryStatus); // ✅ Ensure UI updates immediately
            }
        });
        const listener = AppState.addEventListener('change', handleAppStateChange);
        return () => {listener.remove();listener1.remove();}
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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

                {/* WhatsApp Notification Toggle */}
                <View style={styles.switchWrapper}>
                    <Switch value={whatsapppermission} onValueChange={(value) => toggleSwitch('whatsapp', value)} />
                    <Text>WhatsApp</Text>
                </View>

                {/* Phone Notification Toggle */}
                <View style={styles.switchWrapper}>
                    <Switch value={phonepermission} onValueChange={(value) => toggleSwitch('phone', value)} />
                    <Text>Phone</Text>
                </View>

                {/* Other Notification Toggle */}
                <View style={styles.switchWrapper}>
                    <Switch value={otherpermission} onValueChange={(value) => toggleSwitch('other', value)} />
                    <Text>Other</Text>
                </View>

                {/* Display Notifications */}
                <View style={styles.notificationsWrapper}>
                    {lastMapsNotification && <MapsNotification {...lastMapsNotification} />}
                </View>

                {whatsapppermission && lastWhatsappNotification && (
                    <View>
                        <WhNotification {...lastWhatsappNotification} />
                    </View>
                )}
                {phonepermission && lastPhoneNotification && (
                    <View>
                        <PhoneNotification {...lastPhoneNotification} />
                    </View>
                )}
                {otherpermission && lastOtherNotification && (
                    <View>
                        <PhoneNotification {...lastOtherNotification} />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default App;
