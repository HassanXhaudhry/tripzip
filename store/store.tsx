import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import updateProfileReducer from './slices/updateProfileSlice';
import taxiTypeReducer from './slices/taxiTypeSlice';
import rideReducer from './slices/rideSlice'
import customerInfoReducer from './slices/customerInfoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    updateProfile: updateProfileReducer,
    taxiType: taxiTypeReducer,
    ride: rideReducer,
    customerInfo: customerInfoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // This allows non-serializable values in your state
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
