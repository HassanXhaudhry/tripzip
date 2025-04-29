import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../constants/apiConstants';

interface UpdateProfilePayload {
  cus_uid: string | number;
  userData: Record<string, string>;
}

interface UpdateProfileState {
  loading: boolean;
  fetchLoading: boolean;
  success: boolean;
  error: string | null;
  fetchError: string | null;
}

const initialState: UpdateProfileState = {
  loading: false,
  fetchLoading: false,
  success: false,
  error: null,
  fetchError: null
};

export const fetchUserProfile = createAsyncThunk(
  'profile/fetch',
  async (cus_uid: string | number, { rejectWithValue, dispatch }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      console.log(`Fetching user profile from: ${API_URL}/get_customer/${cus_uid}`);
      
      const response = await axios.get(`${API_URL}/get_customer/${cus_uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response structure:', JSON.stringify(response.data, null, 2));
      
      if (response.data && response.data.data) {
        const userData = response.data.data;
        console.log('Extracted user data:', userData);
        
        try {
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          
          dispatch({
            type: 'auth/updateUserData',
            payload: userData
          });
        } catch (storageError) {
          console.error('Failed to update user in AsyncStorage:', storageError);
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Fetch profile API error:', error.response)
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async ({ cus_uid, userData }: UpdateProfilePayload, { rejectWithValue, dispatch }) => {
    try {
      const token = await AsyncStorage.getItem('token');
     
      console.log(`Sending update request to: ${API_URL}/update_customer/${cus_uid}`);
      console.log('With data:', userData);
     
      const response = await axios.put(`${API_URL}/update_customer/${cus_uid}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
     
      if (response.data && response.data.success) {
        try {
          const storedUserData = await AsyncStorage.getItem('user');
          if (storedUserData) {
            const user = JSON.parse(storedUserData);
            const updatedUser = { ...user, ...userData };
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            
            dispatch({
              type: 'auth/updateUserData',
              payload: updatedUser
            });
          }
        } catch (storageError) {
          console.error('Failed to update user in AsyncStorage:', storageError);
        }
      }
     
      return response.data;
    } catch (error: any) {
      console.error('Update profile API error:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        return rejectWithValue(
          typeof error.response.data === 'string' 
            ? error.response.data 
            : error.response.data?.message || 'Update failed'
        );
      }
      
      return rejectWithValue('Network error or server unreachable');
    }
  }
);

const updateProfileSlice = createSlice({
  name: 'updateProfile',
  initialState,
  reducers: {
    resetUpdateProfileState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state) => {
        state.fetchLoading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = action.payload as string;
      });
  }
});

export const { resetUpdateProfileState } = updateProfileSlice.actions;
export default updateProfileSlice.reducer;