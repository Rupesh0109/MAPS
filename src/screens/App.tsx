import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, Button, View, Switch, ScrollView, AppState } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { BatteryOptEnabled, OpenOptimizationSettings } from '@saserinn/react-native-battery-optimization-check';
import { saveSwitchState, getSwitchState } from '../utils/storage';
import MapsNotification from '../components/MapsNotification';
import PhoneNotification from '../components/PhoneNotification';
import styles from '../styles';
import { RootState } from '../redux/store';
import {  setPhoneEnabled} from '../redux/notificationSlice';

const App = () => {
    const dispatch = useDispatch();

    const [hasPermission, setHasPermission] = useState(false);
    const [hasBatteryPermission, setHasBatteryPermission] = useState(false);

    // Redux: Fetching notifications from the store
    const lastMapsNotification = useSelector((state: RootState) => state.notifications.mapsNotification);
    const lastPhoneNotification = useSelector((state: RootState) => state.notifications.phoneNotification);

    // Redux: Fetching switch states from the store
    const phonepermission = useSelector((state: RootState) => state.notifications.phoneEnabled);

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
                    phoneState
                ] = await Promise.all([
                    getSwitchState('@phonePermission'),
                ]);

                dispatch(setPhoneEnabled(phoneState));
            } catch (error) {
                console.error('Error loading switch states:', error);
            }

            initialLoadRef.current = false;
        };

        loadSwitchStates();
        handleAppStateChange('', true);
    }, []);

    // Handle switch toggle and save to AsyncStorage
    const toggleSwitch = (type: 'phone' , value: boolean) => {
          if (type === 'phone') {
            dispatch(setPhoneEnabled(value));
            saveSwitchState('@phonePermission', value);
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



                {/* Phone Notification Toggle */}
                <View style={styles.switchWrapper}>
                    <Switch value={phonepermission} onValueChange={(value) => toggleSwitch('phone', value)} />
                    <Text>Phone</Text>
                </View>

                {/* Other Notification Toggle */}
                

                {/* Display Notifications */}
                <View style={styles.notificationsWrapper}>
                    {lastMapsNotification && <MapsNotification {...lastMapsNotification} />}
                </View>
                {phonepermission && lastPhoneNotification && (
                    <View>
                        <PhoneNotification {...lastPhoneNotification} />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default App;
