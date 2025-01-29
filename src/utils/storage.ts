import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveSwitchState = async (key: string, value: boolean) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        
    } catch (error) {
        console.error('Error saving switch state', error);
    }
};

export const getSwitchState = async (key: string): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value !== null ? JSON.parse(value) : false;
    } catch (error) {
        console.error('Error retrieving switch state', error);
        return false;
    }
};
