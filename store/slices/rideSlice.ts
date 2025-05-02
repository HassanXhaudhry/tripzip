import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Passenger {
  count: number;
  type: string;
}

interface RideState {
  pickupLocation: string | null;
  dropLocation: string | null;
  date: string;
  time: string;
  returnDate: string;
  returnTime: string;
  hasReturn: boolean;
  passengers: Passenger[];
  stops: string[];
}

const initialState: RideState = {
  pickupLocation: null,
  dropLocation: null,
  date: new Date().toISOString(),
  time: new Date().toISOString(),
  returnDate: new Date().toISOString(),
  returnTime: new Date().toISOString(),
  hasReturn: false,
  passengers: [],
  stops: [],
};

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    setPickupLocation: (state, action: PayloadAction<string>) => {
      state.pickupLocation = action.payload;
    },
    setDropLocation: (state, action: PayloadAction<string>) => {
      state.dropLocation = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload;
    },
    setReturnDate: (state, action: PayloadAction<string>) => {
      state.returnDate = action.payload;
    },
    setReturnTime: (state, action: PayloadAction<string>) => {
      state.returnTime = action.payload;
    },
    setHasReturn: (state, action: PayloadAction<boolean>) => {
      state.hasReturn = action.payload;
    },
    setPassengers: (state, action: PayloadAction<Passenger[]>) => {
      state.passengers = action.payload;
    },
    setStops: (state, action: PayloadAction<string[]>) => {
      state.stops = action.payload;
    },
    clearRide: () => initialState,
  },
});

export const {
  setPickupLocation,
  setDropLocation,
  setDate,
  setTime,
  setReturnDate,
  setReturnTime,
  setHasReturn,
  setPassengers,
  setStops,
  clearRide,
} = rideSlice.actions;

export default rideSlice.reducer;
