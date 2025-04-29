import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstants';

export interface VehicleType {
  id: string;
  title: string;
  price_per_km: number;
  doors?: number;
  horse_power?: string;
  image?: string;
  model?: number;
  seating_capacity?: number;
  shape?: string;
  status?: number;
}

interface TaxiTypeState {
  vehicles: VehicleType[];
  selectedVehicleId: string | null;
  selectedVehicle: VehicleType | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaxiTypeState = {
  vehicles: [],
  selectedVehicleId: null,
  selectedVehicle: null,
  loading: false,
  error: null,
};

export const fetchVehicleTypes = createAsyncThunk(
  'taxiType/fetchVehicleTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/get_vehicles_list`);
      if (response.data && response.data.result && Array.isArray(response.data.result)) {
        return response.data.result;
      }
      
      return [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'Failed to fetch vehicle types');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const taxiTypeSlice = createSlice({
  name: 'taxiType',
  initialState,
  reducers: {
    selectVehicle: (state, action) => {
      state.selectedVehicleId = action.payload;
      state.selectedVehicle = state.vehicles.find(vehicle => vehicle.id === action.payload) || null;
    },
    clearSelection: (state) => {
      state.selectedVehicleId = null;
      state.selectedVehicle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicleTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectVehicle, clearSelection } = taxiTypeSlice.actions;
export default taxiTypeSlice.reducer;