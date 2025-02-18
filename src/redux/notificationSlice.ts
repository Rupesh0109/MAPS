import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
    mapsNotification: any;
    phoneNotification: any;
    phoneEnabled: boolean;
}

const initialState: NotificationState = {
    mapsNotification: null,
    phoneNotification: null,
    phoneEnabled: false,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setMapsNotification: (state, action: PayloadAction<any>) => {
            state.mapsNotification = action.payload;
        },

        setPhoneNotification: (state, action: PayloadAction<any>) => {
            state.phoneNotification = action.payload;
        },
        

        setPhoneEnabled: (state, action: PayloadAction<boolean>) => {
            state.phoneEnabled = action.payload;
        },
        
    }
});

export const { 
    setMapsNotification,  setPhoneNotification, 
     setPhoneEnabled, 
} = notificationSlice.actions;

export default notificationSlice.reducer;
