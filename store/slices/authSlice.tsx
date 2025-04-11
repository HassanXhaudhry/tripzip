import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://115.186.137.140:8181';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: any | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
};

// Load token from AsyncStorage on app startup
export const loadToken = createAsyncThunk('auth/loadToken', async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const userData = await AsyncStorage.getItem('user');
    return {
      token,
      user: userData ? JSON.parse(userData) : null,
    };
  } catch (error) {
    console.error('Error loading token:', error);
    return { token: null, user: null };
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
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
        }
        if (data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
        }
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
    userData: { FullName: string; Email: string; PhoneNo: string; Password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("Sending signup request with data:", userData);
      
      const response = await fetch(`${API_URL}/customer_register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      console.log("Signup Response Status:", response.status);
      console.log("Response Data:", data);
      
      if (response.ok && data?.message === "Signup Successfully") {
        // If the API returns a token on signup, store it
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
        }
        // If the API returns user data, store it
        if (data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
      } else {
        // Return any error message from the API
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
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing data:', error);
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
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.token;
      })
      // Login Cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
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
        // Only set token and user if they were returned from the API
        // Some APIs might not authenticate users immediately after signup
        if (action.payload.token) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout Case
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;