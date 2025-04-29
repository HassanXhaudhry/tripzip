import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstants';

export interface User {
  id?: number;
  username?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  PhoneNo?: string;
  Address?: string;
  Password?: string;
  // Add legacy field names as optional
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
  cus_uid: any
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null;
  user_email: string | null;
  cus_uid: string | null; 
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
  user_email: null,
  cus_uid: null,
};


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

export const login = createAsyncThunk(
  'auth/login',
  async (
    userData: { Email: string; Password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/customer_login`, userData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data;
      const cus_uid = response.headers['cus_uid']; 
      console.log("Login Response:", data);
      console.log("cus_uid from headers:", cus_uid);

      if (data?.message === "Login Successfully") {
        const user = data.data;
        const token = 'someMockTokenOrGenerateOne';

        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);
        if (cus_uid) {
          await AsyncStorage.setItem('cus_uid', cus_uid);
        }

        return { token, user, cus_uid };
      } else {
        return rejectWithValue(data?.message || 'Login failed');
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      return rejectWithValue(error?.response?.data?.message || 'An unexpected error occurred');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    userData: { FullName: string; Email: string; PhoneNo: string; Password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("Sending signup request with data:", userData);

      const response = await axios.post(`${API_URL}/customer_register`, userData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = response.data;
      console.log("Signup Response:", data);

      if (data?.message === "Signup Successfully") {
        if (data.token) await AsyncStorage.setItem('token', data.token);
        if (data.user) await AsyncStorage.setItem('user', JSON.stringify(data.user));
        return data;
      } else {
        return rejectWithValue(data?.message || 'Signup failed');
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      return rejectWithValue(error?.response?.data?.message || 'An unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
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
    updateUserData: (state, action: PayloadAction<User>) => {
      console.log('auth/updateUserData received:', action.payload);
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.token;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.cus_uid = action.payload.cus_uid;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
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
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
