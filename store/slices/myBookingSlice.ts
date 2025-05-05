import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstants';

// Define booking interface
export interface Booking {
  id: string;
  title: string;
  booking_date: string;
  reference_id: string;
  drop_off: string;
  price_per_km: number;
  distance_in_km: number;
  status?: string;
  pickup?: string;
  // Add any other fields from your API response
}

// Define state interface
interface BookingState {
  bookings: Booking[];
  totalBookings: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: BookingState = {
  bookings: [],
  totalBookings: 0,
  loading: false,
  error: null,
};

// Async thunk for fetching customer bookings
export const fetchCustomerBookings = createAsyncThunk(
  'booking/fetchCustomerBookings',
  async (cus_uid: string | number, { rejectWithValue }) => {
    try {
      console.log(`Calling API: ${API_URL}/get_customer_bookings/${cus_uid}`);
      const response = await axios.get(`${API_URL}/get_customer_bookings/${cus_uid}`);
      console.log('API Response:', response.data);
      
      // Check if the API returned a success status
      if (response.data && response.data.status === 'success') {
        return response.data;
      } else if (response.data) {
        // Return whatever data we received even if success flag is not present
        return response.data;
      } else {
        // API returned failure status or unexpected format
        const errorMessage = response.data?.message || 'Failed to fetch bookings';
        console.error('API returned error:', errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      console.error('API call error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to fetch bookings';
        console.error('Axios error details:', errorMessage);
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Create the booking slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookings: (state) => {
      state.bookings = [];
      state.totalBookings = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerBookings.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        
        // Process the response to extract bookings data
        let bookingsData: Booking[] = [];
        
        // Try different possible structures of the API response
        if (action.payload.data && Array.isArray(action.payload.data)) {
          // Direct array in data field
          bookingsData = action.payload.data;
        } else if (action.payload.data && action.payload.data.bookings && Array.isArray(action.payload.data.bookings)) {
          // Nested bookings array
          bookingsData = action.payload.data.bookings;
        } else if (Array.isArray(action.payload)) {
          // Direct array at root
          bookingsData = action.payload;
        } else if (typeof action.payload === 'object' && action.payload !== null) {
          // Try to find an array in the response
          Object.keys(action.payload).forEach(key => {
            if (Array.isArray(action.payload[key])) {
              bookingsData = action.payload[key];
            }
          });
        }
        
        // Log what we found
        console.log('Processed bookings data:', bookingsData);
        
        // Update state with the bookings data
        state.bookings = bookingsData;
        
        // Calculate total bookings from the number of IDs in the response
        state.totalBookings = bookingsData.length;
      })
      .addCase(fetchCustomerBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;