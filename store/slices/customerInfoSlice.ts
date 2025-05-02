import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstants';

// Define the payload interface for the booking information
export interface BookingInfoPayload {
  Address: string;
  Email: string;
  FirstName: string;
  LastName: string;
  MeetGreet: any;
  PhoneNo: string;
  TransferNo: string;
  UserID: number;
  allstops: string;
  childeren: number;
  distanceinkm: string;
  dropofflocation: string;
  infant: number;
  isretrun: number;
  passenger: number;
  pickupdate: string;
  pickuplocation: string;
  pickuptime: string;
  returnTime: string;
  returndate: string;
  vehicleId: string;
}

// Define the state interface
interface CustomerInfoState {
  bookingInfo: BookingInfoPayload | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  bookingId: string | null;
}

// Initial state
const initialState: CustomerInfoState = {
  bookingInfo: null,
  loading: false,
  error: null,
  success: false,
  bookingId: null
};

// Create async thunk for submitting booking info
export const submitBookingInfo = createAsyncThunk(
  'customerInfo/submitBookingInfo',
  async (payload: BookingInfoPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/save_bookinginfo`, payload);
      
      if (response.data && response.data.success) {
        return response.data;
      }
      
      return rejectWithValue(response.data?.message || 'Failed to save booking info');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Network error occurred');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Create the customer info slice
const customerInfoSlice = createSlice({
  name: 'customerInfo',
  initialState,
  reducers: {
    setBookingInfo: (state, action) => {
      state.bookingInfo = action.payload;
    },
    clearBookingInfo: (state) => {
      state.bookingInfo = null;
      state.success = false;
      state.bookingId = null;
      state.error = null;
    },
    resetStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBookingInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitBookingInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bookingId = action.payload.bookingId || null;
      })
      .addCase(submitBookingInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { setBookingInfo, clearBookingInfo, resetStatus } = customerInfoSlice.actions;
export default customerInfoSlice.reducer;