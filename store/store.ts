import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import updateProfileReducer from './slices/updateProfileSlice';
import taxiTypeReducer from './slices/taxiTypeSlice';
import rideReducer from './slices/rideSlice';
import customerInfoReducer from './slices/customerInfoSlice';
import bookingReducer from './slices/myBookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    updateProfile: updateProfileReducer,
    taxiType: taxiTypeReducer,
    ride: rideReducer,
    customerInfo: customerInfoReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;