import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getOrderDetailAPI,
  getOrderHistoryAPI,
  getProfileAPI,
  updateProfileAPI,
} from '../../services/userServices';

export const getProfilSlice = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProfileAPI();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

export const updateProfileSlice = createAsyncThunk(
  'user/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateProfileAPI(payload);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

export const getOrderHistorySlice = createAsyncThunk(
  'user/getOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrderHistoryAPI();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order history'
      );
    }
  }
);

export const getOrderDetailSlice = createAsyncThunk(
  'user/getOrderDetail',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getOrderDetailAPI(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order detail'
      );
    }
  }
);

const initialState = {
  currentUser: null,
  orderHistory: [],
  selectedOrderDetail: {},
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    resetSelectedOrderDetail: (state) => {
      state.selectedOrderDetail = {};
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getProfilSlice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfilSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.data;
      })
      .addCase(getProfilSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateProfileSlice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.currentUser = action.payload.data;
        const newData = action.payload.data;
        state.currentUser = {
          ...state.currentUser,
          ...newData,
          email: state.currentUser.email
        };
      })
      .addCase(updateProfileSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getOrderHistorySlice.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getOrderHistorySlice.fulfilled, (state, action) => {
        state.isLoading = false
        state.orderHistory = action.payload.data
      })
      .addCase(getOrderHistorySlice.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      .addCase(getOrderDetailSlice.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getOrderDetailSlice.fulfilled, (state, action) => {
        state.isLoading = false

        const detailData = action.payload.data
        if (detailData && detailData.booking_id) {
          state.selectedOrderDetail[detailData.booking_id] = detailData
        }
      })
      .addCase(getOrderDetailSlice.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
});

export const { clearUserError, resetSelectedOrderDetail } = userSlice.actions
export default userSlice.reducer
