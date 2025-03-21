import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://115.186.137.140:8181';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Load token from AsyncStorage on app startup
export const loadToken = createAsyncThunk('auth/loadToken', async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Error loading token:', error);
    return null;
  }
});

// Login Action using fetch
export const login = createAsyncThunk(
  'auth/login',
  async (userData: { Email: string; Password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/customer_login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      console.log("Login Response:", response);
      console.log("Response Data:", data);
      
      if (response.ok && data?.message === "Login Successfully") {
        // Optionally, store token in AsyncStorage if needed:
        // await AsyncStorage.setItem('token', data.token);
        return data;
      } else {
        return rejectWithValue(data?.message || 'Login failed');
      }
    } catch (error) {
      console.error("Login Error:", error);
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Signup Action using fetch
export const signup = createAsyncThunk(
  'auth/signup',
  async (
    userData: { Name: string; Email: string; Phone: string; Password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/customer_register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      console.log("Signup Response:", response);
      console.log("Response Data:", data);
      
      if (response.ok && data?.message === "Signup Successfully") {
        // Optionally, store token in AsyncStorage if needed:
        // await AsyncStorage.setItem('token', data.token);
        return data;
      } else {
        return rejectWithValue(data?.message || 'Signup failed');
      }
    } catch (error) {
      console.error("Signup Error:", error);
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Logout Action
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('Error clearing token:', error);
  }
  return null; 
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Token
      .addCase(loadToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      // Login Cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Signup Cases
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout Case
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
