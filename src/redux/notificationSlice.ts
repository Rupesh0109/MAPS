import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
    mapsNotification: any;
    whatsappNotification: any;
    phoneNotification: any;
    otherNotification: any;
    whatsappEnabled: boolean;
    phoneEnabled: boolean;
    otherEnabled: boolean;
}

const initialState: NotificationState = {
    mapsNotification: null,
    whatsappNotification: null,
    phoneNotification: null,
    otherNotification: null,
    whatsappEnabled: false,
    phoneEnabled: false,
    otherEnabled: false,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setMapsNotification: (state, action: PayloadAction<any>) => {
            state.mapsNotification = action.payload;
        },
        setWhatsappNotification: (state, action: PayloadAction<any>) => {
            state.whatsappNotification = action.payload;
        },
        setPhoneNotification: (state, action: PayloadAction<any>) => {
            state.phoneNotification = action.payload;
        },
        setOtherNotification: (state, action: PayloadAction<any>) => {
            state.otherNotification = action.payload;
        },
        setWhatsappEnabled: (state, action: PayloadAction<boolean>) => {
            state.whatsappEnabled = action.payload;
        },
        setPhoneEnabled: (state, action: PayloadAction<boolean>) => {
            state.phoneEnabled = action.payload;
        },
        setOtherEnabled: (state, action: PayloadAction<boolean>) => {
            state.otherEnabled = action.payload;
        }
    }
});

export const { 
    setMapsNotification, setWhatsappNotification, setPhoneNotification, setOtherNotification,
    setWhatsappEnabled, setPhoneEnabled, setOtherEnabled 
} = notificationSlice.actions;

export default notificationSlice.reducer;
