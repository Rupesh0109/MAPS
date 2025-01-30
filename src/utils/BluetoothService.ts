import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const bleManager = new BleManager();
const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0"; // Replace with ESP32's BLE Service UUID
const CHARACTERISTIC_UUID = "abcdef01-1234-5678-1234-56789abcdef0"; // Replace with ESP32's Characteristic UUID

let connectedDevice: Device | null = null;

export const startScanAndConnect = async () => {
    return new Promise<void>((resolve, reject) => {
        bleManager.startDeviceScan(null, null, async (error, device) => {
            if (error) {
                console.error("Scan error:", error);
                reject(error);
                return;
            }

            if (device && device.name?.includes("ESP32")) { // Change "ESP32" to your ESP32's advertised name
                console.log("Connecting to:", device.name);
                bleManager.stopDeviceScan();

                try {
                    const connected = await device.connect();
                    await connected.discoverAllServicesAndCharacteristics();
                    connectedDevice = connected;
                    console.log("Connected to ESP32!");
                    resolve();
                } catch (err) {
                    console.error("Connection error:", err);
                    reject(err);
                }
            }
        });

        setTimeout(() => {
            bleManager.stopDeviceScan();
            reject(new Error("No ESP32 device found"));
        }, 10000); // Stop scanning after 10 seconds
    });
};

export const sendNotificationToESP32 = async (message: string) => {
    if (!connectedDevice) {
        console.warn("ESP32 not connected.");
        return;
    }

    try {
        const data = Buffer.from(message, 'utf-8').toString('base64'); // Convert to Base64
        await connectedDevice.writeCharacteristicWithResponseForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            data
        );
        console.log(`Sent to ESP32: ${message}`);
    } catch (error) {
        console.error("Failed to send data:", error);
    }
};
