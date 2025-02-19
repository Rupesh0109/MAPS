import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, Button, View, Switch, ScrollView, AppState, Platform, PermissionsAndroid } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import { BatteryOptEnabled, OpenOptimizationSettings } from '@saserinn/react-native-battery-optimization-check';
import { saveSwitchState, getSwitchState } from '../utils/storage';
import MapsNotification from '../components/MapsNotification';
import PhoneNotification from '../components/PhoneNotification';
import styles from '../styles';
import { RootState } from '../redux/store';
import {  setPhoneEnabled} from '../redux/notificationSlice';
import WifiManager from 'react-native-wifi-reborn';
import axios from 'axios';


const App = () => {
    const dispatch = useDispatch();

    const [hasPermission, setHasPermission] = useState(false);
    const [hasBatteryPermission, setHasBatteryPermission] = useState(false);
    const[iswifienabled,setiswifiEnabled]=useState(false);
    const[iswificonnected,setiswificonnected]=useState(false);

    

    // Redux: Fetching notifications from the store
    const lastMapsNotification = useSelector((state: RootState) => state.notifications.mapsNotification);
    const lastPhoneNotification = useSelector((state: RootState) => state.notifications.phoneNotification);

    // Redux: Fetching switch states from the store
    const phonepermission = useSelector((state: RootState) => state.notifications.phoneEnabled);

    const handleOnPressPermissionButton = () => {
        RNAndroidNotificationListener.requestPermission();
    };

    const connectToESP32 = async () => {
        try {
          await WifiManager.connectToProtectedSSID('ESP32-SoftAP', '123456789',false, false);
          const ssid = await WifiManager.getCurrentWifiSSID();
          
          if (ssid === 'ESP32-SoftAP') {
            console.log('Successfully connected to ESP32 SoftAP');
            setiswificonnected(true);
          } else {
            console.log('Connected to a different network:', ssid);
            setiswificonnected(false);
          }
        } catch (error) {
          console.log('Failed to connect to ESP32:', error);
          
        }
      };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Permission',
                message: 'This app needs access to your location to check Wi-Fi status.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Location permission granted');
            } else {
              console.log('Location permission denied');
            }
          } catch (err) {
            console.warn(err);
          }
        }
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
    



    const sendNotificationToESP32 = async (message: string) => {
        try {
            const response = await axios.post('http://192.168.4.1/data', message,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 5000, // Set timeout to avoid hanging requests
                }
            );
    
            if (response.status === 200) {
                console.log('Notification sent successfully to ESP32');
            } else {
                console.log('Failed to send notification:', response.status);
            }
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };
    
    
    
    const handleAppStateChange = async (nextAppState: string, force = false) => {
        if (nextAppState === 'active' || force) {
            const status = await RNAndroidNotificationListener.getPermissionStatus();
            const batteryStatus = await BatteryOptEnabled();
            const wifistatus= await WifiManager.isEnabled();
            
            setHasBatteryPermission(!batteryStatus);
            setiswifiEnabled(wifistatus);  // ✅ Fix: Now correctly updates the UI
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
        requestLocationPermission();
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
        if (lastMapsNotification&&iswifienabled&&iswificonnected) {
            sendNotificationToESP32(JSON.stringify(lastMapsNotification));
        }
    }, [lastMapsNotification]);
    useEffect(() => {
        if (lastPhoneNotification&&phonepermission&&iswificonnected&&iswifienabled) {
            sendNotificationToESP32(JSON.stringify(lastPhoneNotification));
        }
    }, [lastPhoneNotification]);
    
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

            <Text style={[styles.permissionStatus, { color: iswifienabled ? 'green' : 'red' }]}>
                        {iswifienabled ? 'Wifi Enabled' : 'Wifi Not Enabled'}
                    </Text>
                </View>
                    
              
                    <Text style={[styles.permissionStatus, { color: iswificonnected ? 'green' : 'red' }]}>
                        {iswificonnected ? 'Connected to device' : 'Not connected to device'}
                    </Text>
                    {iswifienabled&&!iswificonnected && (
                        <Button
                            title="Connect to Device"
                            onPress={connectToESP32}
                            disabled={iswificonnected}
                        />
                    )}
                    
                    



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
